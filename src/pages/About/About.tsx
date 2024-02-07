// File: About.tsx
// Developer: @yannick-leguennec (GitHub username)

import { Title, Text, Container, Flex, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import '../../styles/globalStyles.scss';
import classes from './About.module.scss';
import '../../styles/buttons.scss';

// Functional component for the About Page
function AboutPage() {
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
    // Container for page content with fluid layout for responsive design
    <Container className={`container`}>
      {/* Main title for the About section */}
      <h1 className={`title`}>Apprendre à mieux nous connaître</h1>
      {/* Subtitle for the About section */}
      <h2 className={`subtitle`}>À propos de Family Flow</h2>
      {/* Description text for the Family Flow app */}
      <Text>
        Family Flow est une application conçue pour simplifier la vie des familles modernes. Notre
        objectif est de fournir un outil intuitif et convivial pour gérer les activités familiales
        et renforcer la communication entre les membres de la famille.
      </Text>
      {/* Subtitle for the Vision section */}
      <h2 className={`subtitle`}>Notre Vision</h2>
      {/* Description of the company's vision */}
      <Text>
        Nous croyons en une approche collaborative pour la gestion des tâches ménagères et des
        activités familiales. Family Flow est plus qu&apos;une simple application ; c&apos;est un
        partenaire au quotidien pour connecter et harmoniser les routines de chaque famille.
      </Text>
      {/* Subtitle for the Team section */}
      <h2 className={`subtitle`}>Notre Équipe</h2>
      {/* Description of the team behind Family Flow */}
      <Text>
        L&apos;équipe derrière Family Flow est composée de développeurs passionnés, de designers
        créatifs, et de spécialistes en communication familiale. Nous combinons expertise technique
        et compréhension des dynamiques familiales pour offrir une expérience utilisateur
        exceptionnelle.
      </Text>
      {/* Subtitle for Community Engagement section */}
      <h2 className={`subtitle`}>Rejoignez notre Communauté</h2>
      {/* Invitation for user community engagement */}
      <Text>
        Nous sommes toujours à l&apos;écoute de nos utilisateurs pour améliorer Family Flow.
        N&apos;hésitez pas à nous contacter pour partager vos suggestions ou vos histoires.
        Rejoignez notre communauté et contribuez à façonner l&apos;avenir de la gestion familiale !
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

export default AboutPage;
