// File Name: 500.tsx
// Developer: @yannick-leguennec (GitHub ID)

import { Title, Text, Button, Container, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import '../../styles/globalStyles.scss';
import classes from './500.module.scss';
import '../../styles/buttons.scss';
import useRedirectBasedOnRole from '../../hooks/useRedirectBasedOnRole/useRedirectBasedOnRole';

// This component is displayed when a server error (500) occurs
function ServerError() {
  const navigate = useNavigate(); // Instance of navigate for navigation control

  // Custom hook to redirect user based on their role
  const redirectToAppropriatePage = useRedirectBasedOnRole();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>500</div>
      <Title className={classes.title}>OMG...</Title>
      <Text size="lg" ta="center" className={classes.description}>
        Nos serveurs sont juste trop occupés à sauver le monde présentement. Veuillez réessayer plus
        tard.
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
    </Container>
  );
}

export default ServerError;
