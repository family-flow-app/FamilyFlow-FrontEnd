// File: UserStatusUpdater.tsx
// Developer: @yannick-leguennec (GitHub)

import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';

function UserStatusUpdater() {
  const { user, setUser } = useUser();
  const location = useLocation();
  const lastLocationRef = useRef(location.pathname);
  const handleSuccess = useHandleSuccess();
  const handleError = useApiErrorHandler();

  const updateLocalStorage = (familyId: number, role: string) => {
    if (familyId != null) {
      localStorage.setItem('family_id', familyId.toString());
    }

    if (role != null) {
      localStorage.setItem('role', role);
    }
  };

  useEffect(() => {
    const shouldFetchData =
      user.role !== 'visitor' && location.pathname !== lastLocationRef.current;

    if (shouldFetchData) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `https://family-flow-api.up.railway.app/users/${user.userId}/update`
          );
          console.log('User Status', response.data);

          const { family_id: familyId, role } = response.data;

          if (familyId !== user.familyId || role !== user.role) {
            setUser({ ...user, familyId, role: role ?? 'user' });
            updateLocalStorage(familyId, role);
          }

          handleSuccess(response);
        } catch (error: any) {
          handleError(error);
        }
      };

      fetchUserData();
      lastLocationRef.current = location.pathname;
    }
  }, [location, user.userId, user.role, user.familyId]);

  return null;
}

export default UserStatusUpdater;
