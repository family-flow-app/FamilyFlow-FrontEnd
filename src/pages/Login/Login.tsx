// File name: Login.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React, { useState } from 'react';
import { useToggle, upperFirst, useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Flex,
} from '@mantine/core';
import '../../styles/buttons.scss';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import '../../styles/globalStyles.scss';
import classes from './Login.module.scss';

// Interface for login form values
interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  // Utilisation de hooks React et Mantine
  const navigate = useNavigate();
  // Remplacez ces valeurs par les breakpoints que vous souhaitez utiliser
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { user, setUser } = useUser();
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  const [type] = useToggle(['login']);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Mantine form configuration with validation
  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      // Email validation
      email: (value) => {
        if (!value.trim()) return 'Le champ email est requis';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Email invalide';
        }
        return null;
      },
      // Password validation
      password: (value) => {
        if (!value.trim()) return 'Le mot de passe est requis';
        if (value.length < 8)
          return 'Le mot de passe doit contenir au moins 8 caractères';
        if (!/[A-Z]/.test(value))
          return 'Le mot de passe doit contenir au moins une lettre majuscule';
        if (!/[a-z]/.test(value))
          return 'Le mot de passe doit contenir au moins une lettre minuscule';
        if (!/[\W_]/.test(value))
          return 'Le mot de passe doit contenir au moins un caractère spécial';
        return null;
      },
    },
  });

  // Async function to handle form submission
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await axios.post(
        'https://family-flow-api.up.railway.app/login',
        JSON.stringify(values),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const {
        user_id: userId,
        firstname,
        family_id: familyId,
        role,
      } = response.data.response;
      const token = response.data.token.toString();

      setUser({
        userId,
        familyId,
        role: role ?? 'user',
        firstName: firstname,
        token,
      });

      localStorage.setItem('user_id', userId.toString());
      localStorage.setItem('family_id', familyId?.toString() ?? '');
      localStorage.setItem('role', role ?? 'user');
      localStorage.setItem('firstName', firstname);
      localStorage.setItem('token', token);

      handleSuccess(response);
      navigate('/main');
    } catch (error) {
      if (error instanceof AxiosError) {
        handleError(error);
        setLoginError(
          'Erreur de connexion - Vérifier que votre email ou votre mot de passe sont corrects'
        );
      }
    }
  };

  const handleBackClick = () => {
    // Rediriger vers '/' pour un utilisateur non connecté (role à null)
    // et vers '/main' pour les autres rôles
    if (user.role === 'visitor') {
      navigate('/');
    } else {
      navigate('/main');
    }
  };

  // Main render function for the login form
  return (
    <Container className={`container ${classes.mediaContainer}`}>
      <Flex direction="column" justify="center" align="center" gap={10}>
        <Title className={`${classes.title}`} order={isMobile ? 4 : 1} mb={30}>
          Bon retour sur Family Flow
        </Title>
      </Flex>
      <form
        onSubmit={form.onSubmit(() => handleSubmit(form.values))}
        className="form"
      >
        <Flex direction="column" gap={10}>
          <TextInput
            required
            label="Email"
            placeholder="hello@family.com"
            {...form.getInputProps('email')}
            radius="xl"
          />
          <PasswordInput
            required
            label="Mot de passe"
            placeholder="Votre mot de passe"
            {...form.getInputProps('password')}
            radius="xl"
            mb={10}
          />
        </Flex>
        {loginError && (
          <Flex justify="center">
            <Text className={`${classes.alert} ${classes.mediaContainer}`}>
              {loginError}
            </Text>
          </Flex>
        )}
        <Flex justify="center" mt={20}>
          <Button
            className="outlineButton"
            onClick={handleBackClick}
            w={100}
            m={10}
            size="responsive"
            radius="xl"
          >
            Retour
          </Button>
          <Button
            size="responsive"
            type="submit"
            radius="xl"
            m={10}
            w={100}
            className="gradientButton"
          >
            {upperFirst(type)}
          </Button>
        </Flex>
      </form>
    </Container>
  );
}

export default Login;
