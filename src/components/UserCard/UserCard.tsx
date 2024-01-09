// File Name: UserCard.tsx
import React from 'react';
import { Image, Text, Card, Button, Container, ActionIcon } from '@mantine/core';
import { IconUserQuestion } from '@tabler/icons-react';
import classes from './UserCard.module.scss';
import defaultIcon from '../../public/img/FF_icone-task.png';

interface UserCardProps {
  user: {
    id: number;
    firstname: string;
    lastname: string;
    image_url: string | null;
  };
  onInvite: (id: number) => void;
}

function UserCard({ user, onInvite }: UserCardProps): React.ReactElement {
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
        onClick={() => onInvite(user.id)}
      >
        Infos
      </Button>
    </Card>
  );
}

export default UserCard;
