// ConfirmModal.tsx
// Developer: @yannick-leguennec

import React, { ReactNode } from 'react';
import { Modal, Button, Title, Flex } from '@mantine/core';
import '../../../styles/buttons.scss';
import classes from './ConfirmModal.module.scss';

// Props definition for the ConfirmModal component
interface ConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string | ReactNode;
}

// ConfirmModal component
function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
}: ConfirmModalProps): React.ReactElement {
  // Define custom color for the modal's header
  const modalHeaderColor = '#6bd3d4';

  return (
    <Modal.Root opened={opened} onClose={onClose} centered size="auto">
      {/* Modal overlay with blur effect */}
      <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />

      {/* Modal content */}
      <Modal.Content>
        {/* Modal header with custom background color */}
        <Modal.Header style={{ background: modalHeaderColor, color: 'white' }}>
          <Modal.Title fw={700}>{title}</Modal.Title>
          <Modal.CloseButton style={{ color: 'white' }} />
        </Modal.Header>

        {/* Modal body */}
        <Modal.Body>
          <Title
            className={classes.primeTitle}
            order={4}
            mt={30}
            mb={30}
            style={{ textAlign: 'center' }}
          >
            <strong>{message}</strong>
          </Title>

          {/* Action buttons */}
          <Flex justify="center" align="center" gap={10}>
            {/* Cancel button */}
            <Button
              className="outlineButton"
              mb={30}
              w={170}
              size="responsive"
              radius="xl"
              onClick={onCancel}
            >
              Annuler
            </Button>

            {/* Confirm button */}
            <Button
              className="gradientButton"
              mb={30}
              w={170}
              size="responsive"
              radius="xl"
              onClick={onConfirm}
            >
              Confirmer
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ConfirmModal;
