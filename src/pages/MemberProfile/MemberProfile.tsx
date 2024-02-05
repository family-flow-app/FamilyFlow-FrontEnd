// MemberProfile.tsx
// Developer: @yannick-leguennec

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { Container, Image, Title, Text, Flex, Button } from '@mantine/core';
import FamilyCard from '@/components/Cards/FamilyCard/FamilyCard';
import AlertModal from '@/components/Modals/AlertModal/AlertModal';
import ConfirmModal from '@/components/Modals/ConfirmModal/ConfirmModal';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import iconMember from '../../public/img/FF_icon_member.png';
import { UserData } from '@/@types/user';
import { Family } from '@/@types/family';
import '../../styles/globalStyles.scss';
import classes from './MemberProfile.module.scss';
import '../../styles/buttons.scss';

function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  dayjs.extend(utc);

  const [memberInfo, setMemberInfo] = useState<UserData | null>(null);
  const [familyInfo, setFamilyInfo] = useState<Family | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [buttonText, setButtonText] = useState('');

  console.log('memberInfo', memberInfo);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/families/${user.familyId}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setMemberInfo(response.data);

        if (user.familyId) {
          const familyResponse = await axios.get(
            `${import.meta.env.VITE_BASE_API_URL}/families/${user.familyId}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          console.log('familyResponse', familyResponse.data);

          setFamilyInfo(familyResponse.data);
          handleSuccess(familyResponse);
        }
      } catch (error) {
        console.error(error);
        // Gérer l'erreur comme souhaité
      }
    };

    fetchMemberData();
  }, [id]);

  const handleViewProfile = () => navigate(`/my-family`);

  //! Renders family cards when multiple families are present
  // const familyCards = familyInfo.map((family: Family) => (
  //   <FamilyCard key={family.id} family={family} onViewProfile={handleViewProfile} />
  // ));

  // Fonction pour confirmer la suppression
  const confirmRemoveMember = async () => {
    if (!memberInfo?.id) {
      setAlertMessage('Erreur : Membre non identifié.');
      setButtonText('Retour');
      setIsAlertModalOpen(true);
      closeConfirmModal();
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/families/${user.familyId}/members/${memberInfo.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAlertMessage('Membre expulsé avec succès.');
      setButtonText('Continuer');
      setIsAlertModalOpen(true);
    } catch (error) {
      setAlertMessage("Erreur lors de l'expulsion du membre.");
      setButtonText('Retour');
      setIsAlertModalOpen(true);
    }
    closeConfirmModal();
  };

  // Ouvrir la modal de confirmation
  const openConfirmModal = () => setIsConfirmModalOpen(true);

  // Fermer la modal de confirmation
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  return (
    <Container className={`container ${classes.mediaContainer}`}>
      <Flex direction="column" align="center" justify="center">
        <Image
          src={memberInfo?.image_url || iconMember}
          alt="Member Profile"
          h={250}
          w={250}
          mb={40}
          radius={100}
        />
        <h1 className={`title`}>
          {memberInfo?.firstname} {memberInfo?.lastname}
        </h1>
        <Text mb={20}>@{memberInfo?.username}</Text>
        <h2 className={`subtitle`}>{memberInfo?.description ?? 'Non spécifiée'}</h2>
        <Text mt={5} mb={5}>
          <strong>Membre depuis le</strong>{' '}
          {memberInfo?.created_at
            ? dayjs.utc(memberInfo.created_at).format('DD/MM/YYYY')
            : 'Non spécifiée'}
        </Text>
        <Text mt={5} mb={5}>
          <strong>Anniversaire:</strong>{' '}
          {memberInfo?.birthday
            ? dayjs.utc(memberInfo.birthday).format('DD/MM/YYYY')
            : 'Non spécifiée'}
        </Text>
        <Text mt={5} mb={5}>
          <strong>Contact:</strong> {memberInfo?.email}
        </Text>
        {user.familyId && (
          <Text mb={5} mt={5}>
            <strong>Membre de la famille:</strong>
          </Text>
        )}
        {/* Affichage du composant FamilyCard si user.familyId n'est pas null */}
        {user.familyId && familyInfo && (
          <FamilyCard family={familyInfo} onViewProfile={handleViewProfile} />
        )}
        <Button
          className="outlineButton"
          w={100}
          radius="xl"
          m={10}
          onClick={() => navigate('/my-family')}
        >
          Retour
        </Button>
        {user.role === 'admin' && (
          <>
            <Button
              className="deleteButton"
              w={'auto'}
              radius="xl"
              m={10}
              onClick={openConfirmModal}
            >
              Expulser Membre
            </Button>
            <ConfirmModal
              opened={isConfirmModalOpen}
              onClose={closeConfirmModal}
              onConfirm={confirmRemoveMember}
              onCancel={closeConfirmModal}
              title="Confirmation"
              message={`Voulez-vous vraiment expulser ce membre ?`}
            />
            <AlertModal
              opened={isAlertModalOpen}
              onClose={() => setIsAlertModalOpen(false)}
              title="Alerte"
              buttonText={buttonText}
              redirectTo="/main"
            >
              {alertMessage}
            </AlertModal>
          </>
        )}
      </Flex>
    </Container>
  );
}

export default MemberProfile;
