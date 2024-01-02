// File: useRedirectBasedOnRole.tsx
// Developer: @yannick-leguennec (GitHub username)

import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext'; // Ensure the import path is correct.

// This custom hook is used to redirect users based on their role.
function useRedirectBasedOnRole() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Function to redirect user to the appropriate page based on their role.
  function redirectToAppropriatePage() {
    const { role } = user;

    // Simplified condition to check for various user roles.
    if (role && ['admin', 'member', 'user'].includes(role)) {
      navigate('/main');
    } else {
      navigate('/');
    }
  }

  return redirectToAppropriatePage;
}

export default useRedirectBasedOnRole;

/*
Integration Manual:
1. Import the hook in your component: => import useRedirectBasedOnRole from '../../hooks/useRedirectBasedOnRole/useRedirectBasedOnRole';
2. Declare a constant to store the hook: => const redirectToAppropriatePage = useRedirectBasedOnRole(); Declare it in the component or in a function to be called within the component.
3. Call the redirectToAppropriatePage function in your component's useEffect or in the button of your choice.
*/
