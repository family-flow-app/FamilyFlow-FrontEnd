// DaySection.tsx
// Developed by @yannick-leguennec (GitHub ID)

import React from 'react';
import { Container, Title } from '@mantine/core';
import { Activity } from '../../@types/activity'; // Ensure this path is correct
import ActivityCard from '../Cards/ActivityCard/ActivityCard'; // Ensure this path is correct
import classes from './DaySection.module.scss';
// Interface for the component's props
interface DaySectionProps {
  activities: Activity[];
}

function DaySection({ activities }: DaySectionProps) {
  // Groupe les activités par année, puis par date
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const date = new Date(activity.starting_time ?? '');
      const year = date.getFullYear();
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][formattedDate]) {
        acc[year][formattedDate] = [];
      }

      acc[year][formattedDate].push(activity);
      return acc;
    },
    {} as Record<string, Record<string, Activity[]>>
  );

  return (
    <>
      {Object.entries(groupedActivities).map(([year, dates]) => (
        <React.Fragment key={year}>
          {/* Barre de séparation pour l'année */}
          <Container>
            <Title order={2} className={classes.yearSeparator}>
              {year}
            </Title>
          </Container>

          {Object.entries(dates).map(([date, dailyActivities]) => (
            <React.Fragment key={date}>
              <div className={`${classes.cardContainer}`}>
                <Title order={3} mb={10}>
                  {date}
                </Title>
                {dailyActivities.map((activityItem) => (
                  <ActivityCard key={activityItem.id} activity={activityItem} />
                ))}
              </div>
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

export default DaySection;
