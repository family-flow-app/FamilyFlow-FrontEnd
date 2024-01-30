// AppLoader.tsx
// Developed by @yannick-leguennec

import React, { CSSProperties } from 'react';
import { Loader, Image, Text } from '@mantine/core';
import logo from '../../public/img/FF_logo-homepage.png';
import classes from './AppLoader.module.scss';

/**
 * AppLoader Component
 * Displays a loading screen with a loader animation, title, and loading text.
 */
function AppLoader() {
  const loaderStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  return (
    <div style={loaderStyle}>
      {/* Loader animation */}

      <Image src={logo} className={`${classes.responsiveImage}`} fit="contain" />

      {/* Loader animation */}
      <Loader color="cyan" />

      {/* Loading text */}
      <Text style={{ marginTop: '10px' }}>Chargement en cours...</Text>
    </div>
  );
}

export default AppLoader;
