// File Name: LegalMentions.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React from 'react';
import { Container, Title, Text, Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import '../../styles/globalStyles.scss';
import classes from './LegalMentions.module.scss';
import '../../styles/buttons.scss';

/**
 * TermsPage component represents the legal mentions page of the Family Flow application.
 * This page displays various legal and usage terms for the users.
 */
function TermsPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleBackClick = () => {
    // Rediriger vers '/' pour un utilisateur non connecté (role à null)
    // et vers '/main' pour les autres rôles
    if (user.role === 'visitor') {
      navigate('/');
    } else {
      navigate('/main');
    }
  };

  return (
    <Container className={`container ${classes.mediaContainer}`}>
      {/* Title for the Legal Mentions page */}
      <Title mb={25} className={`${classes.primeTitle}`}>
        Mentions Légales
      </Title>

      {/* Introduction section */}

      <Title order={2} mb={10} className={`${classes.title}`}>
        Introduction
      </Title>
      <Text>
        Bienvenue sur Family Flow. En utilisant notre site web et nos services,
        vous acceptez les présentes conditions. Veuillez les lire attentivement.
      </Text>

      {/* Section for describing the use of the service */}

      <Title order={2} mt={30} mb={10} className={`${classes.title}`}>
        Utilisation du Service
      </Title>
      <Text>
        Description de la manière dont les utilisateurs peuvent ou ne peuvent
        pas utiliser votre service.
      </Text>

      {/* Placeholder for additional sections like privacy, copyright, etc. */}
      {/* Add other sections as needed, such as privacy, copyright, etc. */}

      {/* Section for modifications of the terms */}

      <Title order={2} mt={30} mb={10} className={`${classes.title}`}>
        Modifications des Conditions
      </Title>
      <Text>
        Nous pouvons modifier les conditions à tout moment en publiant une
        version révisée sur ce site.
      </Text>

      {/* Contact information section */}

      <Title order={2} mt={30} mb={10} className={`${classes.title}`}>
        Contact
      </Title>
      <Text>
        Si vous avez des questions sur ces conditions, veuillez nous contacter.
      </Text>
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
      </Flex>
    </Container>
  );
}

export default TermsPage;
