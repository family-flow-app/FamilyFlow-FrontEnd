// File: 404.tsx
// Developer: @yannick-leguennec - Yannick's GitHub ID

import { Container, Title, Text, Button, Image, Flex } from '@mantine/core';
import classes from './404.module.scss';
import picture from '../../public/img/404.family.png';
import '../../styles/buttons.scss';
import useRedirectBasedOnRole from '../../hooks/useRedirectBasedOnRole/useRedirectBasedOnRole';

/**
 * A functional component to display a custom 404 error page.
 * It uses Mantine UI components for a consistent look and feel.
 */
function NothingFoundBackground() {
  // Hook to redirect user based on their role
  const redirectToAppropriatePage = useRedirectBasedOnRole();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.primeTitle}>Oups 404</Title>
          <Image
            src={picture}
            alt="Photo d'une machine à lavée cassée afin d'animer la page 404 signifiant que la page demandée n'existe pas"
            height={250}
          />
          <Text className={classes.description} fw={700}>
            Cette page n&apos;existe pas
          </Text>
          <Text fw={700} className={`${classes.message}`}>
            On répare la machine à laver en t&apos;attendant.
          </Text>
          <Flex justify="center">
            <Button
              className="button outlineButton"
              onClick={redirectToAppropriatePage}
              w={100}
              m={10}
              size="responsive"
              radius="xl"
            >
              Retour
            </Button>
          </Flex>
        </div>
      </div>
    </Container>
  );
}

export default NothingFoundBackground;
