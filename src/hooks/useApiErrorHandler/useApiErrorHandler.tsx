// ErrorHandler.tsx
// Developer: @yannick-leguennec

import { useCallback } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// Defines the structure for custom error data from Axios responses
interface CustomAxiosErrorData {
  message?: string;
}

// Defines the structure for Axios error responses
interface CustomAxiosErrorResponse {
  status: number;
  data: CustomAxiosErrorData;
  message?: string;
}

// Custom hook for handling API errors with Axios
function useApiErrorHandler() {
  const navigate = useNavigate();

  // Handles errors from API requests
  const handleError = useCallback(
    (error: AxiosError<CustomAxiosErrorResponse>) => {
      if (error.response) {
        const { status, data } = error.response;
        console.log(`API Error - Status: ${status}, Message: ${data.message || 'Unknown error'}`);

        // Redirects based on the status code
        switch (status) {
          case 404:
            navigate('/404');
            break;
          case 500:
            navigate('/500');
            break;
          case 503:
            navigate('/503');
            break;
          default:
            console.log('Unhandled specific error', error.response);
            break;
        }
      } else if (error.request) {
        console.log('API Error - Server did not respond.');
      } else {
        console.log('API Error - An unexpected error occurred.');
      }
    },
    [navigate] // Dependency of useCallback is 'navigate'
  );

  return handleError;
}

export default useApiErrorHandler;

/*
Integration Guide:
1. Import the hook into your component: import useApiErrorHandler from '../../hooks/ErrorHandler/ErrorHandler';
2. Declare a constant to store the hook: const handleError = useApiErrorHandler(); Declare it in the component or in a function that will be called in the component.
3. Call the handleError function by passing the error as a parameter: handleError(error) in the catch block of your axios request.
4. And that's it! You can now handle your API errors.
*/
