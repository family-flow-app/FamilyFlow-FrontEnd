// Filename: 503.tsx
// Developed by: @yannick-leguennec (GitHub ID)

// Importing necessary modules and components
import { Title, Text, Button, Group } from '@mantine/core';
import classes from './503.module.scss';
import '../../styles/buttons.scss';
import useRedirectBasedOnRole from '../../hooks/useRedirectBasedOnRole/useRedirectBasedOnRole';

/**
 * ServerOverload Component
 * This component is displayed when the server is overloaded due to high traffic.
 */
function ServerOverload() {
  // Hook to handle redirection based on user role
  const redirectToAppropriatePage = useRedirectBasedOnRole();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.label}>503</div>
        <div className={classes.content}>
          <Title className={classes.title}>Victime de notre succès!</Title>
          <Text size="lg" ta="center" className={classes.description}>
            Vous êtes tellement nombreux à nous avoir rejoint que nos serveurs
            sont surchargés. Nous travaillons d&apos;arrache-pied pour vous
            permettre de profiter de notre service au plus vite. Merci de votre
            patience.
          </Text>
          <Group justify="center">
            <Button
              className="outlineButton"
              onClick={redirectToAppropriatePage}
              w={100}
              m={10}
              size="responsive"
              radius="xl"
            >
              Retour
            </Button>
          </Group>
        </div>
      </div>
    </div>
  );
}

export default ServerOverload;
