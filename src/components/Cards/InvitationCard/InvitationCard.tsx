// File Name: InvitationCard.tsx
import React, { useState } from 'react';
import { Image, Text, Card, Button, Container } from '@mantine/core';
import InvitationInfosModal from '@/components/Modals/InvitationInfosModal/InvitationInfosModal';
import { Invitation } from '@/@types/invitation';
import classes from './InvitationCard.module.scss';
import defaultIcon from '../../../public/img/FF_icone-task.png';

interface InvitationCardProps {
  invitation: Invitation;
  onDelete: (invitationId: number) => void;
  refreshInvitations: () => void;
}

function InvitationCard({
  invitation,
  onDelete,
  refreshInvitations,
}: InvitationCardProps): React.ReactElement {
  // État pour gérer l'affichage de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir la modal
  const openModal = () => setIsModalOpen(true);

  // Fonction pour fermer la modal
  const closeModal = () => setIsModalOpen(false);

  const toUser = invitation.to_user;

  return (
    <Card className={classes.card} withBorder>
      <Image
        className={`${classes.card_image}`}
        src={toUser?.image_url ? toUser.image_url : defaultIcon}
        alt={`${toUser.firstname} ${toUser.lastname}`}
      />
      <Container className={`${classes.card_name}`}>
        <Text className={`${classes.card_text}`}>{`${toUser.firstname} ${toUser.lastname}`}</Text>
      </Container>
      <Button
        className={`gradientButton ${classes.card_button}`}
        type="button"
        size="auto"
        radius="xl"
        onClick={openModal}
      >
        Infos
      </Button>
      <InvitationInfosModal
        invitation={invitation}
        opened={isModalOpen}
        onClose={closeModal}
        onDelete={onDelete}
        refreshInvitations={refreshInvitations}
      />
    </Card>
  );
}

export default InvitationCard;
