// File Name: Home.tsx
// Developer: @yannick-leguennec (GitHub ID)

import { Container, Title, Image, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.scss';
import logo from '../../public/img/FF_logo-homepage.png';
import '../../styles/buttons.scss';

function Home() {
  const navigate = useNavigate();

  return (
    <Container
      className={` ${classes.home} ${classes.gradientBackground} ${classes.mediaContainer}`}
      size="responsive"
    >
      <Image
        src={logo}
        className={`${classes.responsiveImage}`}
        fit="contain"
      />
      <Title order={2} style={{ color: 'white' }} mb={10}>
        Connecte ta famille
      </Title>
      <Button
        size="responsive"
        className="gradientButton"
        onClick={() => navigate('/signup')}
        radius="xl"
        m={10}
        w={100}
      >
        Sign In
      </Button>
      <Button
        size="responsive"
        className="gradientButton"
        onClick={() => navigate('/login')}
        radius="xl"
        m={10}
        w={100}
      >
        Login
      </Button>
    </Container>
  );
}

export default Home;
