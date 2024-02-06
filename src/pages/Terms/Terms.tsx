// File name: Terms.tsx
// Developer: @yannick-leguennec - Yannick's GitHub identifier

import React from 'react';
import { Container, Title, Text, Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import '../../styles/globalStyles.scss';
import classes from './Terms.module.scss';
import '../../styles/buttons.scss';

/**
 * TermsPage component represents the terms and conditions page of the Family Flow application.
 * This page displays various sections of the terms and conditions using Mantine UI components.
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
    <Container className={`container`}>
      {/* Main title of the page */}
      <section>
        <h1 className={`title`}>Conditions d&apos;Utilisation de Family Flow</h1>
        {/* Introduction section */}
        <h2 className={`subtitle`}>Introduction</h2>
        <Text>
          Family Flow est conçu pour aider les familles à mieux gérer leurs emplois du temps, en
          fournissant un outil intuitif et facile à utiliser pour planifier des activités, des
          événements, et des tâches quotidiennes. En vous inscrivant et en utilisant notre service,
          vous acceptez de suivre nos directives d'utilisation établies pour garantir une expérience
          positive et sûre pour tous les utilisateurs.t.
        </Text>
        {/* Service usage guidelines section */}
        <h2 className={`subtitle`}>Utilisation du Service</h2>
        <Text>
          Nous vous encourageons à utiliser Family Flow de manière responsable et respectueuse. Cela
          inclut :
          <ul>
            <li>
              Ne pas utiliser le service à des fins illégales ou pour promouvoir des activités
              illégales.
            </li>
            <li>
              Respecter la vie privée et les droits d'autrui, en ne partageant pas d'informations
              personnelles sans consentement.
            </li>
            <li>
              Éviter la publication ou le partage de contenu nuisible, trompeur, pornographique, ou
              offensant.
            </li>
            <li>
              Ne pas envoyer de spam, y compris des invitations massives, des messages commerciaux
              non sollicités, ou des contenus répétitifs ou non pertinents.
            </li>
            <li>
              Protéger votre compte en utilisant un mot de passe fort et en ne partageant pas vos
              informations de connexion.
            </li>
          </ul>
        </Text>
        {/* Votre Responsabilité */}
        <h2 className={`subtitle`}>Votre Responsabilité</h2>
        <Text>
          En tant qu'utilisateur, vous êtes responsable de votre compte et de l'activité qui s'y
          déroule. Cela signifie maintenir la confidentialité de votre mot de passe et informer
          immédiatement Family Flow en cas de suspicion de piratage ou d'utilisation non autorisée
          de votre compte. Nous travaillons dur pour protéger vos informations, mais Family Flow ne
          peut pas garantir la sécurité de votre compte sans votre coopération.
        </Text>
        {/* Limitations et Exclusions */}
        <h2 className={`subtitle`}>Limitations et Exclusions</h2>
        <Text>
          Bien que Family Flow vise à être accessible et utile pour toutes les familles, nous nous
          réservons le droit de suspendre ou de terminer votre accès au service pour non-respect de
          ces termes d'utilisation. De plus, certaines fonctionnalités peuvent être limitées ou
          indisponibles en fonction de votre localisation ou de dispositifs réglementaires.
        </Text>
        {/* Modifications et Mises à Jour */}
        <h2 className={`subtitle`}>Modifications et Mises à Jour</h2>
        <Text>
          Nous nous engageons à améliorer continuellement Family Flow pour répondre aux besoins de
          nos utilisateurs. Cela peut impliquer de mettre à jour ou de modifier certaines
          fonctionnalités du service. Nous vous informerons de toute modification significative,
          mais nous vous encourageons également à revoir régulièrement les conditions d'utilisation
          pour rester informé des dernières mises à jour.
        </Text>
        {/* Feedback et Suggestions */}
        <h2 className={`subtitle`}>Feedback et Suggestions</h2>
        <Text className={`${classes.stroke}`}>
          Votre feedback est essentiel pour nous aider à améliorer Family Flow. Nous vous
          encourageons à nous envoyer vos commentaires, suggestions, et idées pour de nouvelles
          fonctionnalités. Bien que nous ne puissions pas garantir une réponse individuelle à chaque
          feedback, nous vous assurons que toutes les suggestions sont examinées par notre équipe.
        </Text>
      </section>

      <section>
        {/* Politique de Confidentialité et Protection des Données */}
        <h1 className={`title`}>Politique de Confidentialité et Protection des Données</h1>
        <Text>
          Chez Family Flow, nous comprenons l'importance de la confidentialité et nous nous
          engageons à être transparents sur la manière dont nous collectons, utilisons, et
          partageons vos informations personnelles. Notre politique de confidentialité est conçue
          pour vous aider à comprendre les données que nous collectons, pourquoi nous les
          collectons, et comment vous pouvez exercer vos droits en matière de protection de données.
        </Text>
        {/* Collecte des Données */}
        <h2 className={`subtitle`}>Collecte des Données</h2>
        <Text>
          Pour fournir et améliorer nos services à vous et à votre famille, nous collectons des
          données personnelles telles que votre nom, adresse e-mail, et des informations sur la
          manière dont vous utilisez notre service. Ces informations sont essentielles pour nous
          permettre de créer votre compte, de personnaliser votre expérience, et de vous envoyer des
          notifications pertinentes. Nous collectons ces informations uniquement lorsque vous
          choisissez de nous les fournir en utilisant notre service.
        </Text>
        {/* Utilisation des Données */}
        <h2 className={`subtitle`}>Utilisation des Données</h2>
        <Text>
          Les données personnelles que nous collectons sont utilisées pour améliorer votre
          expérience Family Flow, vous fournir un service client de qualité, et communiquer avec
          vous à propos de votre compte et de nos services. Nous utilisons également ces
          informations pour développer de nouvelles fonctionnalités et protéger la sécurité et
          l'intégrité de notre service. Votre vie privée est au cœur de nos préoccupations, et nous
          nous engageons à ne pas vendre vos données personnelles à des tiers."
        </Text>
        {/* Sécurité des Données */}
        <h2 className={`subtitle`}>Sécurité des Données</h2>
        <Text>
          La sécurité de vos données est une priorité absolue. Nous appliquons des mesures de
          sécurité techniques et organisationnelles avancées pour protéger vos données personnelles
          contre tout accès non autorisé, toute modification non autorisée, divulgation ou
          destruction. Ces mesures incluent des protocoles de cryptage, des pare-feu, et des accords
          de confidentialité pour le personnel ayant accès aux données personnelles.
        </Text>
        {/* Vos Droits */}
        <h2 className={`subtitle`}>Vos Droits</h2>
        <Text>
          Conformément au RGPD, vous avez le droit d'accéder à vos données personnelles, de demander
          leur correction ou suppression, et de vous opposer ou demander la limitation de leur
          traitement. Si vous souhaitez exercer l'un de ces droits ou si vous avez des questions
          concernant le traitement de vos données, n'hésitez pas à nous contacter. Nous sommes
          dédiés à respecter vos choix et à protéger votre vie privée.
        </Text>
        {/* Modifications de la Politique de Confidentialité */}
        <h2 className={`subtitle`}>Modifications de la Politique de Confidentialité</h2>
        <Text>
          Nous nous réservons le droit de modifier cette politique de confidentialité pour refléter
          les changements dans nos pratiques de traitement des données ou dans la législation en
          vigueur. Toutes les modifications seront publiées sur notre site web et, si les
          changements sont significatifs, nous vous fournirons un avis plus direct, comme un e-mail.
          Nous vous encourageons à consulter régulièrement cette page pour les dernières
          informations sur nos pratiques de confidentialité.
        </Text>
        {/* Contact */}
        <h2 className={`subtitle`}>Contact</h2>
        <Text>
          Pour toute question ou préoccupation concernant cette politique de confidentialité ou vos
          données personnelles, veuillez nous contacter via notre page <strong>contact</strong>.
          Votre vie privée est importante pour nous, et nous nous engageons à répondre à vos
          préoccupations.
        </Text>
      </section>
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
