// File Name: InvitationCard.tsx
import React from 'react';
import { Image, Text, Card, Button, Container } from '@mantine/core';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import classes from './InvitationCard.module.scss';
import defaultIcon from '../../public/img/FF_icone-task.png';

interface InvitationCardProps {
  invitation: {
    id: number;
    to_user: {
      id: number;
      firstname: string;
      lastname: string;
      image_url: string | null;
    };
    from_user: {
      id: number;
      firstname: string;
      lastname: string;
      image_url: string | null;
    };
  };
  onDelete: (invitationId: number) => void;
}

function InvitationCard({ invitation, onDelete }: InvitationCardProps): React.ReactElement {
  const { user } = useUser();

  const toUser = invitation.to_user;
  const fromUser = invitation.from_user;

  // Vérifier si l'utilisateur actuel peut voir le bouton Supprimer
  const canDelete = user.role === 'admin' || fromUser.id === user.userId;

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
      >
        Infos
      </Button>
      {/* {canDelete && (
        <Button
          className={`outlineButton ${classes.card_button}`}
          type="button"
          size="auto"
          radius="xl"
          onClick={() => onDelete(invitation.id)}
        >
          Supprimer
        </Button>
      )} */}
    </Card>
  );
}

export default InvitationCard;
