// File: CreateActivity.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextInput,
  Select,
  Textarea,
  Button,
  Text,
  MultiSelect,
  Flex,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { useForm, isNotEmpty } from '@mantine/form';
import { Activity } from '@/@types/activity';
import { Member } from '@/@types/member';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';
import MemberPublicCard from '../../components/Cards/MemberPublicCard/MemberPublicCard';
import classes from './CreateActivity.module.scss';

// Component for editing an activity in the family application
function CreateActivity() {
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
  const { user } = useUser();

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
          `${import.meta.env.VITE_BASE_API_URL}/families/${user.familyId}/users`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setFamilyMembers(response.data);
        handleSuccess(response);
      } catch (error: any) {
        handleError(error);
      }
    };

    fetchFamilyMembers();
  }, [handleError, handleSuccess, user.familyId, user.token]);

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset form error
    setFormError('');

    // Check if form is valid

    if (selectedCategory === '') {
      setFormError('* Vous devez sélectionner une catégorie pour cette activité.');
      return;
    } else if (selectedMembers.length === 0) {
      setFormError('* Vous devez sélectionner au moins un membre pour cette activité.');
      return;
    }

    const { name, description, categoryId, startingTime, endingTime } = form.values;
    const activityInfos = {
      name,
      description,
      category_id: selectedCategory,
      starting_time: startingTime instanceof Date ? startingTime.toISOString() : startingTime,
      ending_time: endingTime instanceof Date ? endingTime.toISOString() : endingTime,
      assigned_to: selectedMembers,
    };

    console.log('activityInfos', activityInfos);

    try {
      const response = await axios.post<Activity>(
        `${import.meta.env.VITE_BASE_API_URL}/families/${user.familyId}/activities`,
        activityInfos,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsSuccess(true);
      setAlertMessage('Activité créée avec succès.');
      setAlertModalOpened(true);
      handleSuccess(response);
    } catch (error: any) {
      setIsSuccess(false);
      setAlertMessage("Erreur lors de la création de l'activité.");
      setAlertModalOpened(true);
      handleError(error);
    }
  };

  return (
    <Container className={`${classes.container}`}>
      <Title className={`${classes.primeTitle}`}>Créer une activité</Title>
      <form onSubmit={handleSubmit} className={`${classes.form}`}>
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
        <Textarea {...form.getInputProps('description')} label="Description" radius="xl" mb={15} />
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
          withAsterisk
          searchable
          clearable
          radius="xl"
          mb={15}
        />
        {formError && (
          <Flex justify="center" align="center">
            <Text size="sm" style={{ color: 'red' }}>
              {formError}
            </Text>
          </Flex>
        )}
        <Flex direction="column" justify="center" align="center">
          {familyMembers
            .filter((member) => selectedMembers.includes(member.id))
            .map((member) => (
              // <MemberPublicCard key={member.id} member={member} activity_id={null}/>
              <MemberPublicCard key={member.id} member={member} />
            ))}
        </Flex>
        <Flex justify="center" align="center">
          <Button
            type="submit"
            className="gradientButton"
            w="auto"
            m={10}
            size="responsive"
            radius="xl"
          >
            Créer
          </Button>
        </Flex>
      </form>

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
    </Container>
  );
}

export default CreateActivity;
