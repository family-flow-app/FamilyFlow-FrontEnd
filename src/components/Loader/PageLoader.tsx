// PageLoader.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React, { CSSProperties } from 'react';
import { Loader, Text } from '@mantine/core';

/**
 * The PageLoader component displays a loading indicator.
 * It uses Mantine UI components for consistent styling.
 */
function PageLoader() {
  // Inline style for the loader container.
  // It ensures the loader is centered both vertically and horizontally.
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Full viewport height
  };

  return (
    <div style={containerStyle}>
      <Loader color="cyan" /> {/* Cyan-colored loader */}
      <Text style={{ marginTop: '10px' }}>Chargement en cours...</Text>{' '}
      {/* Loader text */}
    </div>
  );
}

export default PageLoader;
