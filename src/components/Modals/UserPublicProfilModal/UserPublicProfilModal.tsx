// File Name: UserPublicProfileModal.tsx
// Developer: @yannick-leguennec (GitHub username)

import React, {useState} from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import AlertModal from '../AlertModal/AlertModal';
import {
  Button,
  Flex,
  Image,
  Modal,
  Title,
  Container,
  Text,
} from '@mantine/core';
import { Request } from '../../../@types/request';
import classes from './User.PublicProfilModal.module.scss';
import icon from '../../../public/img/FF_icon_family.png';

interface UserPublicProfileModalProps {
  userRequestInfo: Request | null;
  modalOpened: boolean;
  setModalOpened: (opened: boolean) => void;
  onCloseAdditional?: () => void;
}

function UserPublicProfileModal({
  userRequestInfo,
  modalOpened,
  setModalOpened,
  onCloseAdditional
}: UserPublicProfileModalProps) {

  const {user} = useUser();
  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();  

  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const headerColor = '#6bd3d4';

  // Fonction pour accepter une requête
  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `https://family-flow-api.up.railway.app/families/${user.familyId}/users`,
        { user_id: userRequestInfo?.user_id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      handleSuccess(response);
      setAlertMessage('Requête acceptée avec succès.');
      setAlertModalOpened(true);
      
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
        `https://family-flow-api.up.railway.app/families/${user.familyId}/users/${userRequestInfo?.id}`,
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

  return (
    <Modal.Root
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      className="modal"
      size="auto"
    >
      <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
      <Modal.Content>
        <Modal.Header style={{ background: headerColor, color: 'white' }}>
          <Modal.Title fw={700}>Profil Utilisateur</Modal.Title>
          <Modal.CloseButton style={{ color: 'white' }} />
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" justify="center" align="center">
          <Image
          className={`${classes.image}`}
          src={userRequestInfo?.image_url ? userRequestInfo.image_url : icon}
          alt={`Picture of ${userRequestInfo?.firstname} ${userRequestInfo?.lastname}`} // Assure-toi que request a une propriété senderName ou similaire
        />
          <Title className={`${classes.primeTitle}`}>
            {`${userRequestInfo?.firstname} ${userRequestInfo?.lastname}`}
          </Title>
          <Text mb={20}><strong>{userRequestInfo?.email}</strong></Text>
          <Flex>
            <Button
              onClick={handleAccept}
              className="gradientButton"
              m={10}
              size="responsive"
              radius="xl"
            >
              Accepter
            </Button>
            <Button
              onClick={handleReject}
              className="outlineButton"
              m={10}
              size="responsive"
              radius="xl"
            >
              Refuser
            </Button>
            </Flex>
          </Flex>
          <AlertModal
        opened={alertModalOpened}
        onClose={() => setAlertModalOpened(false)}
        additionalOnClose={onCloseAdditional}
        title="Confirmation"
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

export default UserPublicProfileModal;
