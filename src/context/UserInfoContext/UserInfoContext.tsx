// File: UserInfoContext.tsx
// Developer: @yannick-leguennec (GitHub)

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';

// User interface for type safety
interface User {
  userId: number | null;
  familyId: number | null;
  role: string | null;
  firstName: string | null;
  token: string;
}

// User context properties interface
interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
}

// Provider properties interface
interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// UserProvider component to manage user state
function UserProvider({ children }: UserProviderProps) {
  // Initial user state from localStorage with explicit radix for parseInt
  const initialUserState = {
    userId: parseInt(localStorage.getItem('user_id') ?? '0', 10),
    familyId: localStorage.getItem('family_id')
      ? parseInt(localStorage.getItem('family_id') ?? '0', 10)
      : null,
    role: localStorage.getItem('role') || 'visitor',
    firstName: localStorage.getItem('firstName') ?? null,
    token: localStorage.getItem('token') ?? '',
  };

  const [user, setUser] = useState<User>(initialUserState);
  console.log('Valeurs initiales du localStorage', initialUserState);

  // Effect to update localStorage on user state change
  useEffect(() => {
    console.log(
      "Mise à jour des informations de l'utilisateur dans context :",
      user
    );
    localStorage.setItem('user_id', user.userId?.toString() ?? '0');
    if (user.familyId !== null) {
      localStorage.setItem('family_id', user.familyId.toString());
    }
    localStorage.setItem('role', user.role ?? '');
    localStorage.setItem('firstName', user.firstName ?? '');
    localStorage.setItem('token', user.token);
  }, [user]);

  // Memoized context value to optimize performance
  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Custom hook for accessing user context
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };

/*
Integration Guide for Components:
1) Import useUser from 'UserInfoContext' in the file where it's needed.
2) Use const { user, setUser } = useUser() to access the user object in the component.
3) After Axios request, call setUser with the response data:
   Example with Login request:
   function Login() {
     const { user, setUser } = useUser();
     
     const handleSubmit = async (values) => {
       try {
         const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/login`, values);
         console.log('API Response:', response.data);
         
         const userData = response.data;
         setUser({
           userId: parseInt(userData.user_id, 10),
           familyId: userData.family_id,
           role: userData.role,
           firstName: userData.firstname,
           token: userData.token,
         });
         ...
       } catch (error) {
         ...
       }
     };
   }
  4) To recover data from the user object, use user.userId, user.familyId, user.role, user.firstName and user.token. 
*/
