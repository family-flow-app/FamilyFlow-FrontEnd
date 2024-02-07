// File: InvitationUserCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React, { useState } from 'react';
import axios from 'axios';
import AlertModal from '../../Modals/AlertModal/AlertModal';
import InvitationModal from '../../Modals/InvitationModal/InvitationModal';
import { Image, Text, Card, Container, ActionIcon } from '@mantine/core';
import { InvitationUser } from '@/@types/invitationUSer';
import classes from './InvitationUserCard.module.scss';
import icon from '../../../public/img/FF_icon_member.png';
import { Member } from '@/@types/member';
import { IconUserQuestion, IconCheck, IconX } from '@tabler/icons-react';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';

interface InvitationUserCardProps {
  invitation: InvitationUser;
  onRefreshInvitation: () => void;
}

function InvitationUserCard({
  invitation,
  onRefreshInvitation,
}: InvitationUserCardProps): React.ReactElement<{ member: Member }> {
  const [profileModalOpened, setProfileModalOpened] = useState(false);
  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { user } = useUser();
  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  console.log('user invitations Card', invitation);

  // Fonction pour accepter une requête
  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/invitations/${invitation.id}`,
        { to_user_id: user.userId, family_id: invitation.family_id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log('response', response.data);

      handleSuccess(response.data);
      setAlertMessage('Invitation acceptée avec succès.');
      setAlertModalOpened(true);
    } catch (error: any) {
      handleApiError(error);
      setAlertMessage("Erreur lors de l'acceptation de l'invitation.");
      setAlertModalOpened(true);
    }
  };

  // Fonction pour refuser une requête
  const handleReject = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/invitations/${invitation.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      handleSuccess(response);
      setAlertMessage('Invitation refusée avec succès.');
      setAlertModalOpened(true);
    } catch (error: any) {
      handleApiError(error);
      setAlertMessage("Erreur lors du refus de l'invitation");
      setAlertModalOpened(true);
    }
  };

  // Fonction pour ouvrir la modal de profil utilisateur
  const openUserModal = () => {
    setProfileModalOpened(true);
  };

  // Fonction pour fermer la modal de profil utilisateur
  const closeUserModal = () => {
    setProfileModalOpened(false);
  };

  // Fonction pour fermer la modal de profil utilisateur et rafraîchir les requêtes
  const closeModalAndRefresh = () => {
    if (onRefreshInvitation) {
      onRefreshInvitation(); // Rafraîchit les requêtes
    }
    closeUserModal(); // Ferme UserPublicProfileModal
  };

  return (
    <>
      <Card className={classes.card} withBorder>
        <Image
          className={`${classes.card_image}`}
          src={invitation.image_url ? invitation.image_url : icon}
          alt={`Photo de profil de la famille ${invitation.name}`} // Assure-toi que request a une propriété senderName ou similaire
        />
        <Container className={`${classes.card_name}`}>
          <Text className={`${classes.card_text}`}>{`${invitation.name}`}</Text>
        </Container>
        <ActionIcon
          color="green"
          type="button"
          className={`${classes.card_icon}`}
          mt={5}
          mb={5}
          mr={5}
          radius="xl"
          onClick={handleAccept}
        >
          <IconCheck />
        </ActionIcon>
        <ActionIcon
          color="red"
          type="button"
          className={`${classes.card_icon}`}
          m={5}
          onClick={handleReject}
        >
          <IconX />
        </ActionIcon>
        <ActionIcon
          type="button"
          className={`gradientButton ${classes.card_icon}`}
          mt={5}
          mb={5}
          ml={5}
          onClick={openUserModal}
        >
          <IconUserQuestion />
        </ActionIcon>
      </Card>
      <AlertModal
        opened={alertModalOpened}
        onClose={() => {
          onRefreshInvitation?.();
          setAlertModalOpened(false); // Ferme la modale après le rechargement des requêtes
        }}
        title="Confirmation"
        buttonText="Retour"
        redirectTo="/main"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
      <InvitationModal
        invitation={invitation}
        modalOpened={profileModalOpened}
        setModalOpened={setProfileModalOpened}
        onCloseAdditional={closeModalAndRefresh}
      />
    </>
  );
}

export default InvitationUserCard;

/* Manual of integration of the component in the application
1) Import the component in the file where you want to use it: importInvitationUserCard from './InvitationUserCard/RequestCard';
2) Use the component in the render function: <RequestCard key={request.id} user={request} onViewDetails={handleViewDetails} />
*/
