// File: RequestCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React, {useState} from 'react';
import axios from 'axios';
import AlertModal from '../Modals/AlertModal/AlertModal';
import UserPublicProfileModal from '../Modals/UserPublicProfilModal/UserPublicProfilModal';
import { Image, Text, Card, Container, ActionIcon } from '@mantine/core';
import { Request } from '../../@types/request';
import classes from './RequestCard.module.scss';
import icon from '../../public/img/FF_icon_member.png';
import { Member } from '../../@types/member';
import {IconUserQuestion, IconCheck, IconX} from '@tabler/icons-react';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';

interface RequestCardProps {
    userRequestInfo: Request;
  }

function RequestCard({
    userRequestInfo,
}: RequestCardProps): React.ReactElement<{ member: Member }> {

  const [profileModalOpened, setProfileModalOpened] = useState(false);
  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {user} = useUser();
  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  console.log('userRequestInfo', userRequestInfo);
  

    // Fonction pour accepter une requête
    const handleAccept = async () => {
      try {
        const response = await axios.post(
          `https://family-flow-api.up.railway.app/families/${user.familyId}/users`,
          { user_id: userRequestInfo.user_id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        handleSuccess(response);
        setAlertMessage('Requête acceptée avec succès.');
        setAlertModalOpened(true);
        // Gérer la réponse de succès ici
      } catch (error: any) {
        handleApiError(error);
        setAlertMessage("Erreur lors de l'acceptation de la requête.");
        setAlertModalOpened(true);
      }
    };
  
    // Fonction pour refuser une requête
    const handleReject = async () => {
      try {
        const response = await axios.delete(
          `https://family-flow-api.up.railway.app/families/${user.familyId}/users/${userRequestInfo.id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        handleSuccess(response);
        setAlertMessage('Requête refusée avec succès.');
        setAlertModalOpened(true);
      } catch (error: any) {
        handleApiError(error);
        setAlertMessage("Erreur lors du refus de la requête.");
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

  return (
    <>
    <Card className={classes.card} withBorder>
        <Image
          className={`${classes.card_image}`}
          src={userRequestInfo.image_url ? userRequestInfo.image_url : icon}
          alt={`Picture of ${userRequestInfo.firstname} ${userRequestInfo.lastname}`} // Assure-toi que request a une propriété senderName ou similaire
        />
        <Container className={`${classes.card_name}`}>
          <Text className={`${classes.card_text}`}>
            {`${userRequestInfo.firstname} ${userRequestInfo.lastname}`}
          </Text>
        </Container>
        <ActionIcon
        color='green'
          type="button"
          size="xl"
          mt={5}
          mb={5}
          mr={5}
          radius="xl"
          onClick={handleAccept}
          >
            <IconCheck/>
          </ActionIcon>
          <ActionIcon
        color='red'
          type="button"
          size="xl"
          m={5}
          radius="xl"
          onClick={handleReject}
          >
            <IconX/>
          </ActionIcon>
        <ActionIcon
          className={`gradientButton ${classes.card_button}`}
          type="button"
          size="xl"
          mt={5}
          mb={5}
          ml={5}
          radius="xl"
          onClick={openUserModal}
          >
            <IconUserQuestion/>
          </ActionIcon>
    </Card>
    <AlertModal
        opened={alertModalOpened}
        onClose={() => setAlertModalOpened(false)}
        title="Confirmation"
        buttonText="Retour"
        redirectTo="/my-family"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
      <UserPublicProfileModal
        userRequestInfo={userRequestInfo}
        modalOpened={profileModalOpened}
        setModalOpened={setProfileModalOpened}
        onCloseAdditional={closeUserModal}
      />
    </>
  );
}

export default RequestCard;

/* Manual of integration of the component in the application
1) Import the component in the file where you want to use it: import RequestCard from './RequestCard/RequestCard';
2) Use the component in the render function: <RequestCard key={request.id} user={request} onViewDetails={handleViewDetails} />
*/
