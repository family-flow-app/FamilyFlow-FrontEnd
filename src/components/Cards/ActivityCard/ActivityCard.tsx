// Filename: ActivityCard.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React from 'react';
import {
  Button,
  ActionIcon,
  Badge,
  Group,
  Card,
  useMantineTheme,
  Image,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserInfoContext/UserInfoContext';
import { Activity } from '../../../@types/activity'; // Check the path to ensure it's correct
import { IconQuestionMark, IconUsers } from '@tabler/icons-react';
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
  const { user } = useUser();

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

  console.log('activity', activity);

  return (
    <Card withBorder key={activity.id} className={`${classes.card}`}>
      <Image
        src={activity.category_id !== null ? categoryIcons[activity.category_id] : iconTask}
        alt={
          activity.category_id === 1
            ? 'Icon basé sur le logo de Family Flow décrivant une tâche'
            : 'Icon basé sur le logo de Family Flow décrivant un événement'
        }
        className={`${classes.card_image}`}
      />
      <div className={`${classes.card_infos}`}>
        <Badge color={categoryColor} variant="light" w={110} className={`${classes.card_badge}`}>
          {activity.category_id !== null ? categoryLabels[activity.category_id] : ''}
        </Badge>
        <h1 className={`${classes.card_titre}`}>
          {activity.name && activity.name.length > 25
            ? `${activity.name.substring(0, 25)}...`
            : activity.name}
        </h1>
        {/* <Group className={`${classes.card_time}`}> */}
        <p className={`${classes.card_date}`}>
          {formatTime(activity.starting_time?.toString() || '')} à{' '}
          {formatTime(activity.ending_time?.toString() || '')} {'  -  '}
          {<IconUsers className={`${classes.card_iconUser}`} />} {activity.assigned_to?.length || 0}
        </p>
      </div>
      <Button
        className={`gradientButton ${classes.card_button}`}
        onClick={handleViewDetails}
        size="responsive"
        radius="xl"
      >
        Voir détails
      </Button>
      <div>
        <ActionIcon
          className={`gradientButton ${classes.card_icon}`}
          type="button"
          onClick={handleViewDetails}
        >
          <IconQuestionMark />
        </ActionIcon>
      </div>
      <div
        className={`${classes.card_point} ${activity.user_id === user.userId || activity.assigned_to?.some((assignedUser) => assignedUser.id === user.userId) ? classes.green : classes.red}`}
      ></div>
    </Card>
  );
}

export default ActivityCard;
