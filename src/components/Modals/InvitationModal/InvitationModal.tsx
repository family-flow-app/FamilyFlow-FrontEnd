// File Name: UserRequestModal.tsx
// Developer: @yannick-leguennec (GitHub username)

import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import AlertModal from '../AlertModal/AlertModal';
import { Button, Flex, Image, Modal, Title, Container, Text } from '@mantine/core';
import classes from './InvitationModal.module.scss';
import icon from '../../../public/img/FF_icon_family.png';
import { InvitationUser } from '@/@types/invitationUSer';

interface UserPublicProfileModalProps {
  invitation: InvitationUser;
  modalOpened: boolean;
  setModalOpened: (opened: boolean) => void;
  onCloseAdditional?: () => void;
}

function UserRequestModal({
  invitation,
  modalOpened,
  setModalOpened,
  onCloseAdditional,
}: UserPublicProfileModalProps) {
  const { user } = useUser();
  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  dayjs.extend(utc);

  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const headerColor = '#6bd3d4';

  // Fonction pour accepter une requête
  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/invitations/${invitation.id}`,
        { to_user_id: user.userId, family_id: invitation.family_id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      handleSuccess(response);
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
          <Modal.Title fw={700}>Invitation Détails</Modal.Title>
          <Modal.CloseButton style={{ color: 'white' }} />
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" justify="center" align="center">
            <Title order={2} className={`${classes.title}`} mt={20}>
              Rejoignez la famille :
            </Title>
            <Image
              className={`${classes.image}`}
              src={invitation?.image_url ? invitation.image_url : icon}
              alt={`Picture of ${invitation?.name}`} // Assure-toi que request a une propriété senderName ou similaire
            />
            <Title className={`${classes.primeTitle}`}>{`${invitation?.name}`}</Title>
            <Text mb={20}>
              <strong>{invitation?.description}</strong>
            </Text>
            <Title order={2} className={`${classes.title}`} mt={20}>
              Envoyée par :
            </Title>
            <Image
              className={`${classes.image}`}
              src={invitation?.from_user_id.image_url ? invitation.from_user_id.image_url : icon}
              alt={`Picture of ${invitation?.from_user_id.firstname}`} // Assure-toi que request a une propriété senderName ou similaire
            />
            <Title
              className={`${classes.primeTitle}`}
            >{`${invitation?.from_user_id.firstname} ${invitation?.from_user_id.lastname}`}</Title>
            <Title order={2} className={`${classes.title}`} mt={20}>
              Envoyée le :
            </Title>
            <Text mt={10} mb={20}>
              <strong>{dayjs.utc(invitation?.created_at).format('DD/MM/YYYY')}</strong>
            </Text>
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
            onClose={() => {
              if (onCloseAdditional) {
                onCloseAdditional(); // Appelle onCloseAdditional pour rafraîchir les requêtes
              }
              setAlertModalOpened(false); // Ferme la AlertModal
            }}
            title="Confirmation"
            buttonText="Retour"
            redirectTo="/main"
          >
            <Text>{alertMessage}</Text>
          </AlertModal>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default UserRequestModal;
