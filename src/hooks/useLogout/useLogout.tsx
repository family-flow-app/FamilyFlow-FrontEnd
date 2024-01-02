// File: useLogout.tsx
// Developer: @yannick-leguennec (GitHub username)

import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';

// This custom hook provides functionality for logging out a user.
function useLogout() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  // The `logout` function handles the user logout process.
  const logout = async () => {
    try {
      // Call the API endpoint for logout if available.
      // await apiLogout();

      // Clear user data from the context.
      setUser({
        userId: null,
        familyId: null,
        role: 'visitor',
        firstName: null,
        token: '',
      });

      // Remove user data from localStorage.
      localStorage.removeItem('user_id');
      localStorage.removeItem('family_id');
      localStorage.removeItem('role');
      localStorage.removeItem('firstName');
      localStorage.removeItem('token');

      // Navigate to the home page and reload the window for a clean state.
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return logout;
}

export default useLogout;

/*
Integration Manual:
    import { useLogout } from './useLogout';

    const Component = () => {
        const logout = useLogout();

      Function to handle logout when a button is clicked.
        const handleLogoutClick = () => {
            logout();
        };

        ... Rest of the component

      Assign `handleLogoutClick` to the onClick event of a logout button.
        onClick: handleLogoutClick
    };
*/
