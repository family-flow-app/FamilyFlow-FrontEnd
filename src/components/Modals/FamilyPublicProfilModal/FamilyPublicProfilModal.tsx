// File Name: FamilyProfileModal.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { Button, Flex, Image, Modal, Title, Container, Text } from '@mantine/core';
import { Family } from '../../../@types/family';
import { Member } from '../../../@types/member';
import MemberPublicCard from '../../Cards/MemberPublicCard/MemberPublicCard';
import classes from './FamilyPublicProfilModal.module.scss';
import icon from '../../../public/img/FF_icon_family.png';

interface FamilyProfileModalProps {
  currentFamily: Family | null;
  modalOpened: boolean;
  setModalOpened: (opened: boolean) => void;
  handleRequest: (familyId: number | undefined) => void;
}

function FamilyPublicProfileModal({
  currentFamily,
  modalOpened,
  setModalOpened,
  handleRequest,
}: FamilyProfileModalProps) {
  // Generate cards for family members
  const members = currentFamily?.members.map((member: Member) => (
    <MemberPublicCard key={member.id} member={member} />
  ));

  const headerColor = '#6bd3d4';

  return (
    <Modal.Root
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      className="modal"
      size="auto"
    >
      <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
      <Modal.Content>
        <Modal.Header style={{ background: headerColor, color: 'white' }}>
          <Modal.Title fw={700}>Profil Famille</Modal.Title>
          <Modal.CloseButton style={{ color: 'white' }} />
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" justify="center" align="center">
            <Image
              src={currentFamily?.image_url ? currentFamily?.image_url : icon}
              alt={currentFamily?.name}
              fit="contain"
              className={`${classes.image}`}
            />
            <Title order={1} mb={25} className={`${classes.primeTitle}`}>
              {currentFamily?.name}
            </Title>
            <Text mb={10}>Présentation</Text>
            <Title order={4} className={`${classes.title}`} mb={25}>
              {currentFamily?.description}
            </Title>
            <Text>Membres de la famille</Text>

            <Container>{members}</Container>

            <Button
              onClick={() => handleRequest(currentFamily?.id)}
              className="gradientButton"
              m={10}
              size="responsive"
              radius="xl"
            >
              Rejoindre la famille
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default FamilyPublicProfileModal;
