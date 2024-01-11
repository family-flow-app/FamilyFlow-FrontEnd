// Filename: ActivityRow.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React from 'react';
import { Button, Text, Badge, Group, Card, useMantineTheme, Image, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../../../@types/activity'; // Check the path to ensure it's correct
import '../../../styles/buttons.scss';
import classes from './ActivityCard.module.scss';
import iconTask from '../../../public/img/FF_icone-task.png';
import iconEvent from '../../../public/img/FF_icon.event.png';

interface ActivityCardProps {
  activity: Activity;
}

// This component renders a row for an activity, showing key details and a button to view more
function ActivityCard({ activity }: ActivityCardProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  // Formats time to a more readable format
  function formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Handles the navigation to the details page of the activity
  const handleViewDetails = (): void => {
    navigate(`/activities/${activity.id}`);
  };

  // Mapping of category IDs to labels
  const categoryLabels: { [key: number]: string } = {
    1: 'Tâche',
    2: 'Événement',
  };

  // Mapping of category IDs to icons
  const categoryIcons: { [key: number]: string } = {
    1: iconTask,
    2: iconEvent,
  };

  // Mapping of category IDs to color themes
  const categoryColors: { [key: number]: string; default: string } = {
    1: '#f26751',
    2: '#dba231',
    default: theme.colors.gray[6],
  };

  // Selects the correct color for the category
  const categoryColor = categoryColors[activity.category_id ?? 'default'];

  return (
    <Card withBorder key={activity.id} className={`${classes.card}`}>
      <Image
        src={activity.category_id !== null ? categoryIcons[activity.category_id] : iconTask}
        alt={activity.category_id === 1 ? 'Tâche' : 'Événement'}
        className={`${classes.card_image}`}
      />
      <Group className={`${classes.card_infos}`}>
        <Badge color={categoryColor} variant="light" w={110}>
          {activity.category_id !== null ? categoryLabels[activity.category_id] : ''}
        </Badge>
        <Title className={`${classes.card_titre}`}>
          {activity.name && activity.name.length > 25
            ? `${activity.name.substring(0, 25)}...`
            : activity.name}
        </Title>
        {/* <Group className={`${classes.card_time}`}> */}
        <Text fw={900}>
          {formatTime(activity.starting_time?.toString() || '')} à{' '}
          {formatTime(activity.ending_time?.toString() || '')}
        </Text>
        {/* </Group> */}
      </Group>
      <Button
        className={`gradientButton ${classes.card_button}`}
        onClick={handleViewDetails}
        size="responsive"
        radius="xl"
      >
        Voir détails
      </Button>
    </Card>
  );
}

export default ActivityCard;