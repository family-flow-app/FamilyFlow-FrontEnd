// File Name: MainMember.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Title,
  Group,
  Button,
  Autocomplete,
  rem,
  Container,
  Menu,
  Checkbox,
  Flex,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Activity } from '../../@types/activity';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import DaySection from '../../components/DaySection/DaySection';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import '../../styles/globalStyles.scss';
import classes from './MainMember.module.scss';

function MainMember() {
  // State declarations
  const [activities, setActivities] = useState<Activity[]>([]);
  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]);
  const [hasSearchResults, setHasSearchResults] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'moi' | 'famille' | 'semaine' | 'evenement' | 'tache'
  >('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Context and Hooks
  const { user } = useUser();
  const { familyId, token } = user;
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  // Fetching activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get<Activity[]>(
          `${import.meta.env.VITE_BASE_API_URL}/families/${familyId}/activities`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { data } = response;
        if (data && Array.isArray(data)) {
          // Sorting activities by start time
          const sortedActivities = data.sort(
            (a, b) =>
              (a.starting_time ? new Date(a.starting_time).getTime() : 0) -
              (b.starting_time ? new Date(b.starting_time).getTime() : 0)
          );

          setOriginalActivities(sortedActivities);
          setActivities(sortedActivities);
        }
        handleSuccess(response);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          handleError(error);
        } else {
          console.error('Unexpected error:', error.message);
        }
      }
    };

    if (familyId && token) {
      fetchActivities();
    }
  }, [familyId, token, handleSuccess, handleError]);

  // Filter activities based on selected filter
  const handleCheckboxChange = (
    value: 'all' | 'moi' | 'famille' | 'semaine' | 'evenement' | 'tache'
  ) => {
    setSelectedFilter(value);
    setFilter(value);
  };

  const filters = [
    { value: 'all', label: 'Toutes les activités' },
    { value: 'moi', label: 'Toutes mes activités' },
    { value: 'evenement', label: 'Seulement mes Événements' },
    { value: 'tache', label: 'Seulement mes Tâches' },
    { value: 'semaine', label: 'Des 7 prochains jours' },
    { value: 'famille', label: 'Les activités de ma Famille' },
  ];

  console.log('activities', activities);

  const getFilteredActivities = () => {
    switch (filter) {
      case 'moi':
        return activities.filter(
          (activity) =>
            activity.user_id === user.userId ||
            activity.assigned_to?.some((assignedUser) => assignedUser.id === user.userId)
        );
      case 'famille':
        return activities.filter(
          (activity) =>
            activity.family_id === user.familyId &&
            !activity.assigned_to?.some((assignedUser) => assignedUser.id === user.userId)
        );
      case 'evenement':
        return activities.filter(
          (activity) =>
            activity.category_id === 2 &&
            (activity.user_id === user.userId ||
              activity.assigned_to?.some((assignedUser) => assignedUser.id === user.userId))
        );

      case 'tache':
        return activities.filter(
          (activity) =>
            activity.category_id === 1 &&
            (activity.user_id === user.userId ||
              activity.assigned_to?.some((assignedUser) => assignedUser.id === user.userId))
        );

      case 'semaine': {
        const today = new Date();
        const oneWeekLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

        return activities.filter((activity) => {
          const startDate = new Date(activity.starting_time ?? '');
          return startDate >= today && startDate < oneWeekLater;
        });
      }
      case 'all':
      default:
        return activities;
    }
  };

  // Search functionality
  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = activities.filter((activity) => {
      const nameMatch = activity.name?.toLowerCase().includes(lowerCaseSearchTerm);
      const activityDate = dayjs(activity.starting_time).format('DD/MM/YYYY');
      const dateMatch = activityDate.includes(searchTerm);

      return nameMatch || dateMatch;
    });

    setHasSearchResults(filtered.length > 0);
    setActivities(filtered);
  };

  // Clear search input and reset activities
  const handleClearSearch = () => {
    setSearchTerm('');
    setActivities(originalActivities); // Réinitialise les activités à leur état initial
    setHasSearchResults(true);
    setFilter('all'); // Réinitialise le filtre à 'Toutes les activités'
    setSelectedFilter('all'); // Réinitialise le filtre sélectionné à 'Toutes les activités'
  };

  return (
    <Container className={`container ${classes.extraSettings}`}>
      {/* Activity Search Section */}
      <h1 className={`title`}>Trouve ton activité :</h1>
      <Group className={`${classes.searchContainer}`}>
        <Autocomplete
          className={`${classes.searchBar}`}
          placeholder="Recherche ton activité..."
          leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          value={searchTerm}
          onChange={setSearchTerm}
          radius="xl"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Group>
          <Button
            onClick={handleClearSearch}
            className={`outlineButton ${classes.button}`}
            size="responsive"
            radius="xl"
          >
            Clear
          </Button>
          <Button
            onClick={handleSearch}
            className={`gradientButton ${classes.button}`}
            size="responsive"
            radius="xl"
          >
            Chercher
          </Button>
        </Group>
      </Group>

      {/* No Search Results Message */}
      {!hasSearchResults && (
        <div>
          Aucune activité trouvée pour &quot;{searchTerm}&quot;. Veuillez essayer une autre
          recherche.
        </div>
      )}

      {/* Displaying Activities */}
      <h2 className={`subtitle`}>Mes Activités</h2>
      <Flex justify="center" align="center">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button className={`filterButton ${classes.button}`} size="responsive" radius="xl">
              Filtres
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            {filters.map((option) => (
              <Menu.Item key={option.value}>
                <Checkbox
                  checked={selectedFilter === option.value}
                  onChange={() =>
                    handleCheckboxChange(
                      option.value as 'all' | 'moi' | 'famille' | 'semaine' | 'evenement' | 'tache'
                    )
                  }
                  label={option.label}
                />
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <div className={`${classes.activityContainer}`}>
        <DaySection activities={getFilteredActivities()} />
      </div>
    </Container>
  );
}

export default MainMember;
