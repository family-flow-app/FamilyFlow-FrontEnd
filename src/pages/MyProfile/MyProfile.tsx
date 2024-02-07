// MyProfile.tsx
// Developer: @yannick-leguennec

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Image, Title, Text, Button, Flex } from '@mantine/core';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import useLogout from '../../hooks/useLogout/useLogout';
import { Family } from '../../@types/family';
import { UserData } from '../../@types/user';
import { InvitationUser } from '@/@types/invitationUSer';
import FamilyCard from '../../components/Cards/FamilyCard/FamilyCard';
import InvitationUserCard from '@/components/Cards/InvitationUserCard/InvitationUserCard';
import iconMember from '../../public/img/FF_icon_member.png';
import ConfirmModal from '../../components/Modals/ConfirmModal/ConfirmModal';
import UpdateProfile from '../../components/Modals/UpdateProfile/UpdateProfile';
import '../../styles/globalStyles.scss';
import '../../styles/buttons.scss';
import classes from './MyProfile.module.scss';

// ProfilePage: Displays user's profile information, and family details if applicable.
function MyProfile() {
  // State management for user and family information
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [familyInfo, setFamilyInfo] = useState<Family | null>(null);
  const [invitations, setInvitations] = useState<InvitationUser[]>([]);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  dayjs.extend(utc);

  // Custom hooks for handling API interactions
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  const logout = useLogout();
  const navigate = useNavigate();

  // Fetches user and family data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/users/${user.userId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setUserInfo(handleSuccess(userResponse));

        const fetchInvitations = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/invitations/users/${user.userId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        console.log('invitation', fetchInvitations.data);

        setInvitations(fetchInvitations.data);

        if (user.familyId) {
          const familyResponse = await axios.get(
            `${import.meta.env.VITE_BASE_API_URL}/families/${user.familyId}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          setFamilyInfo(familyResponse.data);
          handleSuccess(familyResponse);
        }
      } catch (error: any) {
        handleError(error);
      }
    };
    fetchUserData();
  }, [user.userId, user.familyId, user.token, handleError, handleSuccess]);

  const fetchInvitations = async () => {
    try {
      const fetchInvitations = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/invitations/users/${user.userId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log('updated invitation', fetchInvitations.data);

      setInvitations(fetchInvitations.data);

      handleSuccess(fetchInvitations);
    } catch (error: any) {
      handleError(error);
    }
  };

  // Navigation handlers
  const handleViewProfile = () => navigate(`/my-family`);
  const handleOpenUpdateProfile = () => setIsUpdateProfileOpen(true);
  const handleCloseUpdateProfile = () => setIsUpdateProfileOpen(false);
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  // Handles profile deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/users/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Profile deleted');
      logout();
    } catch (error: any) {
      handleError(error);
    } finally {
      handleCloseDeleteModal();
    }
  };

  // Fonction permettant de rafraîchir les requêtes
  const refreshInvitations = async () => {
    await fetchInvitations();
  };

  return (
    <Container className={`container ${classes.mediaContainer}`}>
      <Flex direction="column" align="center" justify="center">
        <img src={userInfo?.image_url || iconMember} alt="Ma photo de profil" className={`image`} />
        <h1 className={`title`}>
          {userInfo?.firstname} {userInfo?.lastname}
        </h1>
        <Text mb={20}>@{userInfo?.username}</Text>
        <h2 className={`subtitle`}>{userInfo?.description ?? 'Non spécifiée'}</h2>
        <Text mt={5} mb={5}>
          <strong>Membre depuis le</strong>{' '}
          {userInfo?.created_at
            ? dayjs.utc(userInfo.created_at).format('DD/MM/YYYY')
            : 'Non spécifiée'}
        </Text>
        <Text mt={5} mb={5}>
          <strong>Anniversaire:</strong>{' '}
          {userInfo?.birthday ? dayjs.utc(userInfo.birthday).format('DD/MM/YYYY') : 'Non spécifiée'}
        </Text>
        <Text mt={5} mb={5}>
          <strong>Contact:</strong> {userInfo?.email}
        </Text>
        {user.familyId && (
          <Text mb={5} mt={5}>
            <strong>Membre de la famille:</strong>
          </Text>
        )}
        {/* Affichage du composant FamilyCard si user.familyId n'est pas null */}
        {user.familyId && familyInfo && (
          <FamilyCard key={familyInfo.id} family={familyInfo} onViewProfile={handleViewProfile} />
        )}
        {/* Affiche les invitations de l'utilisateur s'il en a reçu */}
        {!user.familyId ? (
          <>
            <Text mt={5} mb={5}>
              <strong>
                Invitations reçues
                {invitations && invitations.length > 0 ? ` (${invitations.length})` : ''} :
              </strong>
            </Text>
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <InvitationUserCard
                  key={invitation.id}
                  invitation={invitation}
                  onRefreshInvitation={refreshInvitations}
                />
              ))
            ) : (
              <Text mt={5} mb={5}>
                Aucune invitation reçue.
              </Text>
            )}
          </>
        ) : null}

        <Flex justify="center" className={`${classes.buttonGroup}`}>
          <Button
            className="gradientButton"
            w={'auto'}
            radius="xl"
            m={10}
            onClick={handleOpenUpdateProfile}
          >
            Modifier Profil
          </Button>
          <Button
            className="outlineButton"
            w={'auto'}
            radius="xl"
            m={10}
            onClick={handleOpenDeleteModal}
          >
            Supprimer Profil
          </Button>
        </Flex>
        <ConfirmModal
          opened={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          title="Confirmer la suppression"
          message={
            <div>
              <span>
                Es-tu sûr de vouloir supprimer ton profil ?<br />
              </span>
              <span>Cette action est irréversible.</span>
            </div>
          }
        />
        {userInfo ? (
          <UpdateProfile
            opened={isUpdateProfileOpen}
            close={handleCloseUpdateProfile}
            userInfo={userInfo}
            setUser={setUserInfo}
          />
        ) : null}
      </Flex>
    </Container>
  );
}

export default MyProfile;
