// File Name: UserCard.tsx
import React, { useState } from 'react';
import { Image, Text, Card, Button, Container } from '@mantine/core';
import classes from './UserInvitationCard.module.scss';
import defaultIcon from '../../../public/img/FF_icone-task.png';
import UserInvitationModal from '../../Modals/UserInvitationModal/UserInvitationModal';
import { UserData } from '@/@types/user';

interface UserCardProps {
  user: UserData;
  onInvite: (id: number) => void;
}

function UserInvitationCard({ user, onInvite }: UserCardProps): React.ReactElement {
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

  const openUserInfoModal = () => setIsUserInfoModalOpen(true);
  const closeUserInfoModal = () => setIsUserInfoModalOpen(false);

  return (
    <Card className={classes.card} withBorder>
      <Image
        className={`${classes.card_image}`}
        src={user.image_url ? user.image_url : defaultIcon}
        alt={`${user.firstname} ${user.lastname}`}
      />
      <Container className={`${classes.card_name}`}>
        <Text className={`${classes.card_text}`}>{`${user.firstname} ${user.lastname}`}</Text>
      </Container>
      <Button
        className={`gradientButton ${classes.card_button}`}
        type="button"
        size="auto"
        radius="xl"
        onClick={() => onInvite(user.id)}
      >
        Inviter
      </Button>
      <Button
        className={`outlineButton ${classes.card_button}`}
        type="button"
        size="auto"
        radius="xl"
        onClick={openUserInfoModal}
      >
        Infos
      </Button>
      <UserInvitationModal
        opened={isUserInfoModalOpen}
        onClose={closeUserInfoModal}
        userInfos={user}
      />
    </Card>
  );
}

export default UserInvitationCard;
