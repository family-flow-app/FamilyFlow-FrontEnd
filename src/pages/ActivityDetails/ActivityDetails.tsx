// File Name: ActivityDetails.tsx
// Developer: @yannick-leguennec (GitHub Username)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Button, Container, Title, Flex } from '@mantine/core';
import dayjs from 'dayjs';
import { Activity } from '../../@types/activity';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import { Member } from '../../@types/member';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';
import ActivityEditModal from '../../components/Modals/ActivityEditModal/ActivityEditModal';
import '../../styles/globalStyles.scss';
import classes from './ActivityDetails.module.scss';
import '../../styles/buttons.scss';
import MemberPublicCard from '../../components/Cards/MemberPublicCard/MemberPublicCard';

function ActivityDetails() {
  // States
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [activityDetails, setActivityDetails] = useState<Activity | null>(null);
  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertModalLeaveActivityOpened, setAlertModalLeaveActivityOpened] = useState(false);
  const [alertMessageLeaveActivity, setAlertMessageLeaveActivity] = useState('');
  const [responseTrue, setResponseTrue] = useState(false);

  // Custom Hooks
  const { id } = useParams<{ id: string }>();
  const activityId = id ? parseInt(id, 10) : null;
  const { user } = useUser();
  const { familyId, token } = user;
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  const navigate = useNavigate();
  const isUserAuthorized = user.role === 'admin' || user.userId === activityDetails?.user_id;

  // Function to format date and time
  const formatDateTime = (date: Date | null) => {
    if (date === null) {
      return 'No date provided';
    }
    return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '';
  };

  // Category labels mapping
  const categoryLabels: { [key: number]: string } = {
    1: 'Tâche',
    2: 'Événement',
    // Add more categories as needed
  };

  // Fetch activity details
  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!activityId || !familyId || !token) return;

      try {
        const response = await axios.get<Activity>(
          `${import.meta.env.VITE_BASE_API_URL}/families/${familyId}/activities/${activityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Verify if the user belongs to the activity's family
        if (response.data.family_id !== familyId) {
          navigate('/main');
          return;
        }

        setActivityDetails(response.data);
        console.log('activity', response.data);

        handleSuccess(response);
      } catch (error: any) {
        handleError(error);
      }
    };

    if (activityId) fetchActivityDetails();
  }, [activityId, familyId, token, navigate, handleSuccess, handleError]);

  // Function to open the edit modal
  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  // Function to close the edit modal
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  // Function to save the activity after editing
  const handleSaveActivity = (updatedActivity: Activity) => {
    setActivityDetails(updatedActivity);
    setEditModalOpen(false);
  };

  // Function to leave an activity
  const handleLeaveActivity = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/activities/${activityDetails?.id}/user/${
          user.userId
        }`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setResponseTrue(true);
      setAlertMessageLeaveActivity("Vous avez quitté l'activité avec succès.");
      setAlertModalLeaveActivityOpened(true);
      handleSuccess(response.data);
      console.log(response);
    } catch (error: any) {
      setResponseTrue(false);
      setAlertMessageLeaveActivity("Erreur lors de la suppression de l'activité.");
      setAlertModalLeaveActivityOpened(true);
      handleError(error);
      console.log(error);
    }
  };

  // Function to delete the activity
  const handleDeleteActivity = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/families/${familyId}/activities/${activityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlertMessage('Activité supprimée avec succès.');
      setAlertModalOpened(true);
      handleSuccess(response);
    } catch (error: any) {
      setAlertMessage("Erreur lors de la suppression de l'activité.");
      setAlertModalOpened(true);
      handleError(error);
    }
  };

  // Render activity details
  return (
    <Container className={`container ${classes.extraSettings}`}>
      {/* Activity Details */}
      {activityDetails && (
        <Flex direction={'column'} align={'center'}>
          <h1 className={`title`}>{activityDetails.name}</h1>
          <Container className={`${classes.infos}`}>
            <Text>
              <strong>Type d&apos;activité: </strong>{' '}
              {activityDetails.category_id
                ? categoryLabels[activityDetails.category_id]
                : 'Unknown Category'}
            </Text>
            <Text>
              <strong>Description:</strong>{' '}
              {activityDetails?.description ? activityDetails.description : 'aucune description'}
            </Text>
            <Text>
              <strong className={`${classes.strong}`}>Date et heure de début: </strong>{' '}
              {activityDetails.starting_time
                ? formatDateTime(activityDetails.starting_time)
                : 'No date provided'}
            </Text>
            <Text>
              <strong className={`${classes.strong}`}>Date et heure de fin: </strong>{' '}
              {formatDateTime(activityDetails.ending_time)}
            </Text>
          </Container>
        </Flex>
      )}
      {/* List of Participants */}
      {activityDetails && (
        <Flex direction={'column'} align={'center'}>
          <h2 className={`subtitle`}>Participants</h2>
          {activityDetails?.assigned_to?.map((member: Member) => (
            // <MemberPublicCard key={member.id} member={member} activity_id={activityId} />
            <MemberPublicCard key={member.id} member={member} />
          ))}
        </Flex>
      )}
      {/* Edit and Delete Buttons (if authorized) */}
      {isUserAuthorized && (
        <Container className={`${classes.containerButtons}`}>
          <Button
            onClick={handleOpenEditModal}
            size="responsive"
            type="submit"
            radius="xl"
            className={` gradientButton ${classes.button}`}
          >
            Modifier
          </Button>
          <Button
            onClick={handleDeleteActivity}
            className={`outlineButton ${classes.button}`}
            size="auto"
            radius="xl"
          >
            Supprimer
          </Button>
        </Container>
      )}
      {!isUserAuthorized && activityDetails?.category_id === 2 && (
        <>
          <Flex justify="center" align="center">
            <Button
              onClick={handleLeaveActivity}
              w={150}
              mt={10}
              type="submit"
              radius="xl"
              className={` outlineButton`}
            >
              Quitter l&apos;activité
            </Button>
          </Flex>
        </>
      )}
      {familyId != null && (
        <ActivityEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          activityDetails={activityDetails}
          onSave={handleSaveActivity}
          familyId={familyId}
          token={token}
        />
      )}
      <AlertModal
        opened={alertModalOpened}
        onClose={() => setAlertModalOpened(false)}
        title="Confirmation"
        buttonText="Continuer"
        redirectTo="/main"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
      <AlertModal
        opened={alertModalLeaveActivityOpened}
        onClose={() => setAlertModalLeaveActivityOpened(false)}
        title={responseTrue ? 'Confirmation' : 'Erreur'}
        buttonText={responseTrue ? 'Continuer' : 'Retour'}
        redirectTo={responseTrue ? '/main' : ''}
      >
        <Text>{alertMessageLeaveActivity}</Text>
      </AlertModal>
    </Container>
  );
}

export default ActivityDetails;
