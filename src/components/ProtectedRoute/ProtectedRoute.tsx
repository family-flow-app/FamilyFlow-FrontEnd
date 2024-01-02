// ProtectedRoute.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';

function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.role) {
      // If the user is not logged in, redirect them to '/main'
      navigate('/main');
    } else if (user.role === 'visitor' && !allowedRoles.includes('visitor')) {
      // If the user has the 'visitor' role but is not authorized for this route, redirect them to '/'
      navigate('/');
    } else if (user.role === 'user' && !allowedRoles.includes('user')) {
      // If the user has the 'user' role but is not authorized for this route, redirect them to '/main'
      navigate('/main');
    } else if (user.role === 'member' && !allowedRoles.includes('member')) {
      // If the user has the 'member' role but is not authorized for this route, redirect them to '/main'
      navigate('/main');
    } else if (user.role === 'admin' && !allowedRoles.includes('admin')) {
      // If the user has the 'admin' role but is not authorized for this route, redirect them to '/main'
      navigate('/main');
    }
  }, [user, allowedRoles, navigate]);

  return <Outlet />;
}

export default ProtectedRoute;
