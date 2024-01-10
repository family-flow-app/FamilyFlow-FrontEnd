import React, { useState } from 'react';
import { Modal, Image, Text, Title, Button, Flex } from '@mantine/core';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { Invitation } from '@/@types/invitation';
import iconMember from '../../../public/img/FF_icon_member.png';
import classes from './InvitationInfosModal.module.scss';

interface InvitationInfosModalProps {
  invitation: Invitation;
  opened: boolean;
  onClose: () => void;
  onDelete: (invitationId: number) => void;
  refreshInvitations: () => void;
}

function InvitationInfosModal({
  invitation,
  opened,
  onClose,
  onDelete,
  refreshInvitations,
}: InvitationInfosModalProps): React.ReactElement {
  const { user } = useUser();
  const headerColor = '#6bd3d4';
  // Vérifie si l'utilisateur actuel peut voir le bouton Supprimer
  const canDelete = user.role === 'admin' || invitation.from_user.id === user.userId;
  // État pour gérer l'affichage de ConfirmModal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Fonction pour ouvrir ConfirmModal
  const openConfirmModal = () => setIsConfirmModalOpen(true);

  // Fonction pour fermer ConfirmModal
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirmDelete = async () => {
    await onDelete(invitation.id);
    await refreshInvitations();
    // Fermer les modals
    closeConfirmModal();
    onClose();
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} centered size="sm">
      <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
      <Modal.Content>
        <Modal.Header style={{ background: headerColor, color: 'white' }}>
          <Modal.Title fw={700}>Infos Invitation</Modal.Title>
          <Modal.CloseButton style={{ color: 'white' }} />
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" justify="center" align="center">
            <Title className={`${classes.primeTitle}`} mt={40} mb={30}>
              Invitation
            </Title>
            <Title order={4} className={`${classes.title}`} mb={10}>
              <strong>Envoyé à: </strong>{' '}
            </Title>
            <Image className={`${classes.image}`} src={iconMember} alt="Image profil" />
            <Title
              mb={20}
              order={3}
            >{`${invitation.to_user.firstname} ${invitation.to_user.lastname}`}</Title>
            <Title order={4} className={`${classes.title}`} mb={10}>
              <strong>De la part de: </strong>{' '}
            </Title>
            <Image className={`${classes.image}`} src={iconMember} alt="To User" />
            <Title
              mb={20}
              order={3}
            >{`${invitation.from_user.firstname} ${invitation.from_user.lastname}`}</Title>
          </Flex>
          {/* <Title order={4} className={`${classes.title}`} mb={25}>
            <strong>Le: </strong>{' '}
          </Title>
          <Title mb={20} order={3}>{`${invitation.created_at}`}</Title> */}
          {canDelete && (
            <Flex direction="column" justify="center" align="center">
              <Button
                className={`outlineButton`}
                type="button"
                size="auto"
                radius="xl"
                m={20}
                onClick={setIsConfirmModalOpen}
              >
                Supprimer
              </Button>
            </Flex>
          )}
          <ConfirmModal
            opened={isConfirmModalOpen}
            onClose={closeConfirmModal}
            onConfirm={handleConfirmDelete}
            onCancel={closeConfirmModal}
            title="Confirmer la suppression"
            message="Es-tu sûr de vouloir supprimer cette invitation ?"
          />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default InvitationInfosModal;
