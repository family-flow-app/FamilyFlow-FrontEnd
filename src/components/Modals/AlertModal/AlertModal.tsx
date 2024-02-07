// File name: AlertModal.tsx
// Developer: @yannick-leguennec (GitHub ID)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Flex, Title, Container } from '@mantine/core';
import '../../../styles/buttons.scss';
import classes from './AlertModal.module.scss';

// Interface for the AlertModal's properties
interface CustomModalProps {
  opened: boolean; // Boolean to control the visibility of the modal
  onClose: () => void; // Function to call when closing the modal
  additionalOnClose?: () => void; // Additional function to call when closing the modal
  title: string; // Title of the modal
  buttonText: string; // Text for the button inside the modal
  redirectTo: string; // URL to redirect to when the button is clicked
  children: React.ReactNode; // Children components to be rendered inside the modal
}

// The AlertModal component
function AlertModal({
  opened,
  onClose,
  additionalOnClose,
  title,
  buttonText,
  redirectTo,
  children,
}: CustomModalProps): React.ReactElement {
  // Hook to navigate to different routes
  const navigate = useNavigate();

  // Custom color for the modal's header
  const modalHeaderColor = '#6bd3d4';

  // Handler for the button click event
  const handleRedirect = () => {
    if (additionalOnClose) {
      additionalOnClose(); // Appelle additionalOnClose si elle est fournie
    }
    onClose(); // Ferme la modal
    navigate(redirectTo); // Redirige l'utilisateur
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} centered size="xs">
      <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
      <Modal.Content>
        <Modal.Header style={{ background: modalHeaderColor }} />
        <Flex direction="column" justify="center" align="center" gap={30}>
          <Title order={2} mt={30} className={`${classes.primeTitle}`}>
            {title}
          </Title>
          <Container ml={10} mr={10}>
            {children}
          </Container>
          <Button
            className="gradientButton"
            onClick={handleRedirect}
            mb={30}
            w={'auto'}
            size="responsive"
            radius="xl"
          >
            {buttonText}
          </Button>
        </Flex>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AlertModal;

/* Integration Guide:
To use AlertModal in your component:
1. Import AlertModal => import AlertModal from '../AlertModal/AlertModal';
2. Create a state to control the opening/closing of the modal => const [alertModalOpened, setAlertModalOpened] = useState(false);
3. Create a state to store the message to be displayed in the modal => const [alertMessage, setAlertMessage] = useState('');
4. place the following code in your component's return statement: 
      <AlertModal
        opened={alertModalOpened}
        onClose={() => setAlertModalOpened(false)}
        title="Confirmation"
        buttonText="Retour"
        redirectTo="/main"
      >
  Be careful do give the right props to the component: opened, onClose, title, buttonText and redirectTo.
  5. Fihnally add the logic of your component in the answer of the API call. For example:

    try {
      const response = await axios.put<Activity>(
        `${import.meta.env.VITE_BASE_API_URL}/families/${familyId}/activities/${id}`,
        updatedActivity,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(response.data);
    !  setAlertMessage('Activité mise à jour avec succès.');
    !  setAlertModalOpened(true);
      handleSuccess(response);
    } catch (error: any) {
    !  setAlertMessage("Erreur lors de la modification de l'activité.");
    !  setAlertModalOpened(true);
      handleError(error);
    }
  };
*/
