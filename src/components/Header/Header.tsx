// Filename: HeaderSimple.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React from 'react';
import { Container, Group, Burger, Image, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useLogout from '../../hooks/useLogout/useLogout';
import '../../styles/globalStyles.scss';
import classes from './HeaderSimple.module.scss';
import logo from '../../public/img/FF-logo-header.png';

type LinkItem = {
  link: string;
  label: string;
  onClick?: () => void;
};

type LinkDict = {
  [key: string]: LinkItem[];
};

function HeaderSimple() {
  const [opened, handlers] = useDisclosure(false);
  const { user } = useUser();
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  // Checks if the current pathname is active
  const isActive = (pathname: string) => location.pathname === pathname;

  // Redirects to '/main' if user is logged in, else to '/' when logo is clicked
  const handleLogoClick = () => {
    const redirectTo = user.userId ? '/main' : '/';
    navigate(redirectTo);
  };

  // Triggers logout action
  const handleLogoutClick = () => {
    logout();
  };

  // Navigation links for different user roles
  const links: LinkDict = {
    // Links visible to regular users
    user: [
      { link: '/main', label: 'Accueil' },
      { link: '/create-family', label: 'Créer une famille' },
      { link: '/my-profile', label: user.firstName || 'Mon profil' },
      { link: '/home', label: 'Logout', onClick: handleLogoutClick },
    ],
    // Additional links for 'member' role
    member: [
      { link: '/main', label: 'Accueil' },
      { link: '/create-activity', label: 'Créer une activité' },
      { link: '/my-family', label: 'Ma famille' },
      { link: '/my-profile', label: user.firstName || 'Mon profil' },
      { link: '/home', label: 'Logout', onClick: handleLogoutClick },
    ],
    // Additional links for 'admin' role
    admin: [
      { link: '/main', label: 'Accueil' },
      { link: '/create-activity', label: 'Créer une activité' },
      { link: '/my-family', label: 'Ma famille' },
      { link: '/my-profile', label: user.firstName || 'Mon profil' },
      { link: '/home', label: 'Logout', onClick: handleLogoutClick },
    ],
  };

  // Determines the current user role for navigation
  const currentRole =
    user.role && Object.keys(links).includes(user.role) ? user.role : 'visitor';

  // Maps each link to a navigation item
  const navigationLinks = (links[currentRole] || []).map((item) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (item.onClick) {
        event.preventDefault();
        item.onClick();
      }
      handlers.close();
    };

    return (
      <Link
        key={item.label}
        to={item.link}
        onClick={handleClick}
        className={`${classes.link} ${
          isActive(item.link) ? classes.active : ''
        }`}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <header className={classes.header}>
      {/* <Container className={classes.inner}> */}
      {/* Logo with click handler to redirect */}
      <Image
        className="logo"
        radius="md"
        h="40px"
        w="auto"
        fit="contain"
        src={logo}
        alt="Family Flow logo"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      {/* Navigation links group */}
      <Group className={`${classes.links}`} visibleFrom="sm">
        {navigationLinks}
      </Group>
      {/* Burger menu for smaller screens */}
      <Burger
        opened={opened}
        onClick={handlers.toggle}
        hiddenFrom="sm"
        size="md"
        className={classes.burger}
      />
      {/* </Container> */}

      {/* Overlay for navigation when menu is opened */}
      {opened && <div className={classes.overlay}>{navigationLinks}</div>}
    </header>
  );
}

export default HeaderSimple;
