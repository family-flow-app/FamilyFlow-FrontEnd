// File: Main.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React from 'react';
import { useUser } from '../../context/UserInfoContext/UserInfoContext'; // Importing the user context
import MainUser from '../MainUser/MainUser'; // Importing the MainUser component
import MainMember from '../MainMember/MainMember'; // Importing the MainMember component
import '../../styles/globalStyles.scss';

// The Main component serves as a conditional renderer based on user roles.
function Main() {
  const { user } = useUser(); // Accessing user data from context

  let ComponentToRender; // Initializing variable to determine which component to render

  // Switch case to decide which component to render based on user role
  switch (user.role) {
    case 'user':
      ComponentToRender = <MainUser />;
      break;
    case 'member':
      ComponentToRender = <MainMember />;
      break;
    case 'admin':
      ComponentToRender = <MainMember />;
      // Assuming 'admin' should also render the MainMember component, adjust if needed
      break;
    default:
      ComponentToRender = <div>Role inconnu ou non connecté</div>;
    // Displaying message for unknown or unauthenticated users
  }

  return ComponentToRender; // Rendering the selected component
}

export default Main;
