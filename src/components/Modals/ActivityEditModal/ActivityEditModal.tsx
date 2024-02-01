// File: ActivityEditModal.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, TextInput, Select, Textarea, Button, Text, MultiSelect, Flex } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Activity } from '../../../@types/activity';
import { Member } from '../../../@types/member';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../../hooks/useHandleSuccess/useHandleSuccess';
import AlertModal from '../AlertModal/AlertModal';
import MemberPublicCard from '../../Cards/MemberPublicCard/MemberPublicCard';

interface ActivityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityDetails: Activity | null;
  familyId: number;
  token: string;
  onSave: (updatedActivity: Activity) => void;
}

// Component for editing an activity in the family application
function ActivityEditModal({
  isOpen,
  onClose,
  activityDetails,
  familyId,
  token,
  onSave,
}: ActivityEditModalProps) {
  // State management for family members and selected members
  const [familyMembers, setFamilyMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Hook for handling API errors and success
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  // Header color for modal
  const headerColor = '#6bd3d4';

  // Form initialization and validation setup
  const form = useForm({
    initialValues: {
      id: null as number | null | undefined,
      name: '',
      description: '',
      startingTime: new Date(),
      endingTime: new Date(),
      categoryId: '' as string | null | undefined,
      family_id: null as number | null | undefined,
      user_id: null as number | null | undefined,
      assigned_to: [] as number[] | never[] | undefined,
    },
    // Custom validation for form fields
    validate: {
      name: (value) => {
        const defaultValue = value ?? ''; // Fournir une valeur par défaut de chaîne vide
        if (defaultValue.length > 50) return 'Le nom ne doit pas dépasser 50 caractères';
        if (defaultValue.length === 0) return 'Le nom est requis';
        return null; // Pas d'erreur
      },
      description: (value = '') =>
        value.length > 1000 ? 'La description ne doit pas dépasser 1000 caractères' : null,
      startingTime: (value, values) =>
        value &&
        values.endingTime &&
        new Date(value).getTime() > new Date(values.endingTime).getTime()
          ? 'La date de début doit être avant la date de fin'
          : null,
      endingTime: (value, values) =>
        value &&
        values.startingTime &&
        new Date(value).getTime() < new Date(values.startingTime).getTime()
          ? 'La date de fin doit être après la date de début'
          : null,
    },
  });

  /* Effect for fetching all family members, the members already assigned to the activity and
   build the form with all the information of the activity when the modal opens */
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get<Member[]>(
          `${import.meta.env.VITE_BASE_API_URL}/families/${familyId}/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFamilyMembers(response.data);
        handleSuccess(response);
      } catch (error: any) {
        handleError(error);
      }
    };

    if (isOpen) {
      fetchFamilyMembers();
      setSelectedMembers(activityDetails?.assigned_to?.map((member) => member.id) || []);
      if (activityDetails) {
        form.setValues({
          id: activityDetails.id,
          name: activityDetails.name || '',
          description: activityDetails.description || '',
          startingTime: activityDetails.starting_time
            ? new Date(activityDetails.starting_time)
            : new Date(),
          endingTime: activityDetails.ending_time
            ? new Date(activityDetails.ending_time)
            : new Date(),
          categoryId: activityDetails.category_id?.toString() || '',
          family_id: activityDetails.family_id,
          user_id: activityDetails.user_id,
          assigned_to: activityDetails.assigned_to?.map((member) => member.id) || [],
        });
        setSelectedCategory(activityDetails.category_id?.toString() || '');
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, familyId, token, activityDetails]);

  // Effect to ensure that ending time is not before starting time
  useEffect(() => {
    const { startingTime, endingTime } = form.values;
    if (startingTime && endingTime && startingTime > endingTime) {
      form.setFieldValue('endingTime', startingTime);
    }
  }, [form.values.startingTime, form]);

  // Fonction pour gérer le changement de la valeur du Select
  const handleCategoryChange = (value: string | null) => {
    if (value) {
      setSelectedCategory(value);
    }
  };

  // Function to handle form submission and save changes
  const handleSaveChanges = async () => {
    console.log('handleSaveChanges 1');

    if (selectedCategory === '') {
      setFormError('* Vous devez sélectionner une catégorie pour cette activité.');
      return;
    } else if (selectedMembers.length === 0) {
      setFormError('* Vous devez sélectionner au moins un membre pour cette activité.');
      return;
    }

    console.log('handleSaveChanges 2');

    const { name, description, categoryId, startingTime, endingTime, id } = form.values;
    const updatedActivity = {
      name,
      description,
      category_id: selectedCategory,
      starting_time: startingTime instanceof Date ? startingTime.toISOString() : startingTime,
      ending_time: endingTime instanceof Date ? endingTime.toISOString() : endingTime,
      assigned_to: selectedMembers,
    };
    console.log('handleSaveChanges 3');
    console.log('updatedActivity', updatedActivity);

    try {
      const response = await axios.put<Activity>(
        `${import.meta.env.VITE_BASE_API_URL}/families/${familyId}/activities/${id}`,
        updatedActivity,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('handleSaveChanges 4');

      onSave(response.data);
      console.log('handleSaveChanges 5');

      setIsSuccess(true);
      setAlertMessage('Activité mise à jour avec succès.');
      console.log('handleSaveChanges 6');

      setAlertModalOpened(true);
      console.log('handleSaveChanges 7');
      handleSuccess(response);
    } catch (error: any) {
      console.log('reponse', error);

      setIsSuccess(false);
      setAlertMessage("Erreur lors de la modification de l'activité.");
      setAlertModalOpened(true);
      handleError(error);
    }
  };

  // Render the modal and form
  return (
    <>
      <Modal.Root opened={isOpen} onClose={onClose} centered className="modal" size="auto">
        <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
        <Modal.Content>
          <Modal.Header style={{ background: headerColor, color: 'white' }}>
            <Modal.Title fw={700}>Modifier une activité</Modal.Title>
            <Modal.CloseButton style={{ color: 'white' }} />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={form.onSubmit(handleSaveChanges)}>
              {/* Editing form fields */}
              <TextInput
                label="Nom"
                {...form.getInputProps('name')}
                withAsterisk
                required
                radius="xl"
                mt={30}
                mb={15}
              />
              <Textarea
                {...form.getInputProps('description')}
                label="Description"
                radius="xl"
                mb={15}
              />
              <Select
                label="Catégorie"
                data={[
                  { value: '1', label: 'Tâche' },
                  { value: '2', label: 'Événement' },
                ]}
                value={selectedCategory}
                onChange={handleCategoryChange}
                withAsterisk
                required
                radius="xl"
                mb={15}
              />
              <DateTimePicker
                label="Date et heure de début"
                {...form.getInputProps('startingTime')}
                withAsterisk
                required
                radius="xl"
                mb={15}
              />
              <DateTimePicker
                label="Date et heure de fin"
                {...form.getInputProps('endingTime')}
                withAsterisk
                required
                radius="xl"
                mb={15}
              />
              <MultiSelect
                data={familyMembers.map((member) => ({
                  value: member.id.toString(),
                  label: `${member.firstname} ${member.lastname}`,
                }))}
                value={selectedMembers.map((id) => id.toString())}
                onChange={(selectedValues) => setSelectedMembers(selectedValues.map(Number))}
                checkIconPosition="right"
                withScrollArea={false}
                label="Membres participants"
                searchable
                clearable
                radius="xl"
                mb={15}
              />
              <Flex direction="column" justify="center" align="center">
                {familyMembers
                  .filter((member) => selectedMembers.includes(member.id))
                  .map((member) => (
                    <MemberPublicCard key={member.id} member={member} />
                  ))}
              </Flex>
              {formError && (
                <Flex justify="center" align="center">
                  <Text size="sm" style={{ color: 'red' }}>
                    {formError}
                  </Text>
                </Flex>
              )}
              <Flex justify="center" align="center">
                <Button
                  type="submit"
                  className="gradientButton"
                  w="auto"
                  m={10}
                  size="responsive"
                  radius="xl"
                >
                  Sauvegarder
                </Button>
              </Flex>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {/* Alert Modal for confirmation messages */}
      <AlertModal
        opened={alertModalOpened}
        onClose={() => setAlertModalOpened(false)}
        title="Confirmation"
        buttonText={isSuccess ? 'Continuer' : 'Retour'}
        redirectTo="/main"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
    </>
  );
}

export default ActivityEditModal;
