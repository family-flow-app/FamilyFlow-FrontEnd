// UserInvitationModal.tsx
import React, { useState } from 'react';
import { Modal, Flex, Text, Title, Image, Button } from '@mantine/core';
import AlertModal from '../AlertModal/AlertModal';
import axios from 'axios';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import icon from '../../../public/img/FF_icon_member.png';
import classes from './UserInvitationModal.module.scss';
import { UserData } from '@/@types/user';

interface UserInvitationModalProps {
  opened: boolean;
  onClose: () => void;
  userInfos: UserData;
}

function UserInvitationModal({
  opened,
  onClose,
  userInfos,
}: UserInvitationModalProps): React.ReactElement {
  const { user } = useUser();
  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const headerColor = '#6bd3d4';

  // Fonction pour confirmer l'invitation
  const handleConfirmInvitation = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/invitations`,
        {
          to_user_id: userInfos.id,
          family_id: user.familyId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      handleSuccess(response);
      console.log('Invitation envoyée avec succès !');
      setAlertMessage('Invitation envoyée avec succès.');
      setAlertModalOpened(true);
    } catch (error: any) {
      handleApiError(error);
      setAlertMessage("Erreur lors de l'envoi de l'invitation");
      setAlertModalOpened(true);
    }
  };

  // Fonction combinée pour fermer AlertModal et UserInvitationModal
  const closeBothModals = () => {
    setAlertModalOpened(false);
    onClose(); // Cette fonction ferme UserInvitationModal
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} centered size="auto" className="modal">
      <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
      <Modal.Content>
        <Modal.Header style={{ background: headerColor, color: 'white' }}>
          <Modal.Title fw={700}>Profil Utilisateur</Modal.Title>
          <Modal.CloseButton style={{ color: 'white' }} />
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" align="center">
            <Image
              className={`${classes.image}`}
              src={userInfos.image_url ? userInfos.image_url : icon}
              alt={`Picture of ${userInfos.firstname} ${userInfos.lastname}`}
            />
            <Title className={`${classes.primeTitle}`}>
              {`${userInfos.firstname} ${userInfos.lastname}`}
            </Title>
            {/* <Text mb={20}>
              <strong>Contact: {userInfos?.email ? userInfos.email : 'Non disponible'}</strong>
            </Text>

            <Text mb={20}>
              <strong>
                {' '}
                Anniversaire: {userInfos?.birthday ? userInfos.birthday : 'Non disponible'}
              </strong>
            </Text> */}
            <Button
              onClick={handleConfirmInvitation}
              className="gradientButton"
              m={10}
              size="responsive"
              radius="xl"
            >
              Inviter
            </Button>
          </Flex>
          <AlertModal
            opened={alertModalOpened}
            onClose={closeBothModals}
            title="confirmation"
            buttonText="Retour"
            redirectTo="/my-family"
          >
            <Text>{alertMessage}</Text>
          </AlertModal>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default UserInvitationModal;
