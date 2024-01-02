// File: useHandleSuccess.tsx
// Developer: @yannick-leguennec (GitHub username)

import { useCallback } from 'react';
import { AxiosResponse } from 'axios';

// This custom hook is used to handle successful API responses.
const useHandleSuccess = () => {
  // `handleSuccess` processes different success responses from the API.
  const handleSuccess = useCallback((response: AxiosResponse) => {
    switch (response.status) {
      case 200:
        // Handle standard success response.
        console.log('Succès (200) : ', response.data);
        return response.data; // Returns the processed data.
      case 201:
        // Handle success response for resource creation.
        console.log('Création réussie (201) : ', response.data);
        return response.data;
      default:
        // Handle other successful responses.
        console.log(
          `Réponse API réussie - Statut: ${response.status}, Données: `,
          response.data
        );
        return response.data;
    }
  }, []);

  return handleSuccess;
};

export default useHandleSuccess;

/*
Integration Guide:
1. Import the hook into your component: 
   import useHandleSuccess from './path/to/useHandleSuccess';
2. Declare a constant to store the hook: 
   const handleSuccess = useHandleSuccess();
3. Call the handleSuccess function by passing the response as a parameter:
   handleSuccess(response) in the then block of your axios request.
4. And that's it! You can now handle your API success responses.
*/
