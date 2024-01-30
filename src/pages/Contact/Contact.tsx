/* Contact.tsx - Page for contact form */
/* Developed by @yannick-leguennec - GitHub ID */

// Importing necessary components and styles
import React, { useState } from 'react';
import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  Container,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import '../../styles/globalStyles.scss';
import classes from './Contact.module.scss';
import '../../styles/buttons.scss';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';

function Contact() {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const handleSuccess = useHandleSuccess();
  const handleApiError = useApiErrorHandler();
  const redirectTo = user.role === 'visitor' ? '/' : '/main';

  const handleBackClick = () => {
    // Rediriger vers '/' pour un utilisateur non connecté (role à null)
    // et vers '/main' pour les autres rôles
    if (user.role === 'visitor') {
      navigate('/');
    } else {
      navigate('/main');
    }
  };

  // useForm hook for managing form state and validation
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  const handleFormSubmit = async (values: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      console.log('Values submitted:', values);
      const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/send-email`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Gérer la réponse positive ici, par exemple afficher un message de succès
      handleSuccess(response.data);
      setModalOpen(true);
    } catch (error: any) {
      // Gérer les erreurs ici
      handleApiError(error);
    }
  };

  return (
    <Container className={`container ${classes.mediaContainer}`}>
      <AlertModal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Message envoyé !"
        buttonText="Continuer"
        redirectTo={redirectTo}
      >
        <Text className={`${classes.textModal}`}>
          Nous vous remercions pour votre message et nous vous répondrons dans les plus brefs
          délais.
        </Text>
      </AlertModal>
      {/* Form submission handling */}
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        {/* Title of the Contact Form */}
        <Title className={`${classes.primeTitle}`} mb={25}>
          Contactez nous
        </Title>

        {/* Grid layout for Name and Email input fields */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
          <TextInput
            label="Nom"
            placeholder="Votre nom"
            name="name"
            variant="filled"
            {...form.getInputProps('name')}
            radius="xl"
            required
          />
          <TextInput
            label="Email"
            placeholder="Votre email"
            name="email"
            variant="filled"
            {...form.getInputProps('email')}
            radius="xl"
            required
          />
        </SimpleGrid>

        {/* Subject input field */}
        <TextInput
          label="Sujet"
          placeholder="Sujet"
          mt="md"
          name="subject"
          variant="filled"
          {...form.getInputProps('subject')}
          radius="xl"
          required
        />

        {/* Message textarea */}
        <Textarea
          mt="md"
          label="Message"
          placeholder="Votre message"
          maxRows={10}
          minRows={5}
          autosize
          name="message"
          variant="filled"
          {...form.getInputProps('message')}
          radius="xl"
          required
        />

        {/* Submit button */}
        <Group justify="center" mt="xl">
          <Button
            className={`outlineButton ${classes.button}`}
            onClick={handleBackClick}
            w={100}
            m={10}
            size="responsive"
            radius="xl"
          >
            Retour
          </Button>
          <Button
            className={`gradientButton ${classes.button}`}
            type="submit"
            size="responsive"
            radius="xl"
          >
            Envoyer
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default Contact;
