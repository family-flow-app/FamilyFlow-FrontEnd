// File: FamilyProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Group, Image, Text, Title, Flex } from '@mantine/core';
import ConfirmModal from '@/components/Modals/ConfirmModal/ConfirmModal';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import MemberPrivateCard from '../../components/MembePrivateCard/MemberPrivateCard';
import RequestCard from '@/components/RequestCard/RequestCard';
import { Family } from '../../@types/family';
import { Member } from '../../@types/member';
import familyIcon from '../../public/img/FF_icon_family.png';
import '../../styles/globalStyles.scss';
import '../../styles/buttons.scss';
import classes from './FamilyProfile.module.scss';

const FamilyProfile = () => {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState<
    'informations' | 'members' | 'requests' | 'invitations'
  >('informations');
  const [familyInfo, setFamilyInfo] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  const navigate = useNavigate();
  dayjs.extend(utc);

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      try {
        const familyInfoResponse = await axios.get(
          `https://family-flow-api.up.railway.app/families/${user.familyId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setFamilyInfo(handleSuccess(familyInfoResponse));
      } catch (error: any) {
        handleApiError(error);
      }
    };

    fetchFamilyInfo();
  }, [user.familyId, user.token, handleSuccess, handleApiError]);

  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers();
    } else if (activeTab === 'invitations') {
      fetchInvitations();
    } else if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  // Fonction pour charger les membres
  const fetchMembers = async () => {
    try {
      const membersResponse = await axios.get(
        `https://family-flow-api.up.railway.app/families/${user.familyId}/users`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMembers(handleSuccess(membersResponse));
      handleSuccess(membersResponse);
    } catch (error: any) {
      handleApiError(error);
    }
  };

  // Fonction pour charger les requêtes
  const fetchRequests = async () => {
    try {
      const requestsResponse = await axios.get(
        `https://family-flow-api.up.railway.app/requests/families/${user.familyId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setRequests(handleSuccess(requestsResponse));
      handleSuccess(requestsResponse);
    } catch (error: any) {
      handleApiError(error);
    }
  };

  // Fonction permettant de rafraîchir les requêtes
  const refreshRequests = async () => {
    await fetchRequests();
  };

  // Fonction pour charger les invitations
  const fetchInvitations = async () => {
    try {
      const invitationsResponse = await axios.get(
        `https://family-flow-api.up.railway.app/invitations/${user.familyId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setInvitations(handleSuccess(invitationsResponse));
      handleSuccess(invitationsResponse);
    } catch (error: any) {
      handleApiError(error);
    }
  };

  // Fonction pour confirmer la sortie de la famille
  const confirmFamilyExit = async () => {
    closeConfirmModal();
    try {
      const response = await axios.delete(
        `https://family-flow-api.up.railway.app/families/${user.familyId}/members/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // Mise à jour des informations de l'utilisateur et redirection
      setUser({
        ...user,
        familyId: null,
        role: 'user',
      });
      localStorage.removeItem('family_id');
      localStorage.setItem('role', 'user');
      navigate('/main');

      handleSuccess(response);
    } catch (error: any) {
      handleApiError(error);
    }
  };

  // Fonction pour supprimer la famille
  const deleteFamily = async () => {
    try {
      const response = await axios.delete(
        `https://family-flow-api.up.railway.app/families/${user.familyId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // Mise à jour des informations de l'utilisateur et redirection
      setUser({
        ...user,
        familyId: null,
        role: 'user',
      });
      localStorage.removeItem('family_id');
      localStorage.setItem('role', 'user');
      navigate('/main');
      handleSuccess(response);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      closeConfirmModal();
    }
  };

  // Gestion des clics sur les onglets
  const handleTabClick = (tabName: 'informations' | 'members' | 'requests' | 'invitations') => {
    setActiveTab(tabName);
  };

  const handleViewProfile = (id: number) => {
    console.log('Redirection vers le profil du membre', id);
    // Logique pour rediriger vers le profil du membre
  };

  // Fonction pour gérer l'ouverture de la modal Confirm
  const openConfirmModal = () => setConfirmModalOpen(true);

  // Fonction pour gérer la fermeture de la modal Confirm
  const closeConfirmModal = () => setConfirmModalOpen(false);

  return (
    <Container className={`container ${classes.mediaContainer}`}>
      <Flex direction={'column'} align={'center'}>
        {familyInfo && (
          <>
            <Image
              src={familyInfo[0]?.image_url || familyIcon}
              alt="Profile"
              h={250}
              w={250}
              mt={40}
              mb={40}
              radius={100}
            />
            <Title className={`${classes.primeTitle}`} mb={30}>
              {familyInfo[0]?.name}
            </Title>
          </>
        )}
        <Group className={`${classes.separator}`} pb={20}>
          <Button
            className={activeTab === 'informations' ? `${classes.activeTabButton}` : 'filterButton'}
            onClick={() => handleTabClick('informations')}
            w={125}
            radius="xl"
          >
            Informations
          </Button>
          <Button
            className={activeTab === 'members' ? `${classes.activeTabButton}` : 'filterButton'}
            onClick={() => handleTabClick('members')}
            w={125}
            radius="xl"
          >
            Membres
          </Button>
          <Button
            className={activeTab === 'requests' ? `${classes.activeTabButton}` : 'filterButton'}
            onClick={() => handleTabClick('requests')}
            w={125}
            radius="xl"
          >
            Requêtes
          </Button>
          <Button
            className={activeTab === 'invitations' ? `${classes.activeTabButton}` : 'filterButton'}
            onClick={() => handleTabClick('invitations')}
            w={125}
            radius="xl"
          >
            Invitations
          </Button>
        </Group>
        {activeTab === 'informations' && (
          <>
            <Title order={3} mt={30} mb={5}>
              {familyInfo && (familyInfo[0]?.description ?? 'Non spécifiée')}
            </Title>
            <Text m={5}>
              Existe depuis le:{' '}
              {familyInfo &&
                (familyInfo[0]?.created_at
                  ? dayjs.utc(familyInfo[0].created_at).format('DD/MM/YYYY')
                  : 'Non spécifiée')}
            </Text>
            <Text m={5}> Administrateur(s): </Text>
            <Button className="outlineButton" mb={30} onClick={openConfirmModal} radius="xl" m={5}>
              Quitter famille
            </Button>
            {user.role === 'admin' && (
              <Button className="deleteButton" onClick={() => setIsDeleteModalOpen(true)}>
                Supprimer famille
              </Button>
            )}
          </>
        )}
        {activeTab === 'members' && (
          <>
            <Text mt={20}>{`Nombre de membres: (${members.length})`}</Text>
            {members.map((member) => (
              <MemberPrivateCard
                key={member.id}
                member={member}
                onViewProfile={handleViewProfile}
              />
            ))}
          </>
        )}

        {activeTab === 'requests' &&
          requests.map(
            (request) => (
              console.log(request),
              (
                <RequestCard
                  key={request.id}
                  userRequestInfo={request}
                  onRefreshRequests={refreshRequests}
                />
              )
            )
          )}
        {activeTab === 'invitations' &&
          invitations.map((invitation) => (
            <div key={invitation.id}>{/* Logique pour afficher les invitations */}</div>
          ))}
      </Flex>
      <ConfirmModal
        opened={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmFamilyExit}
        onCancel={closeConfirmModal}
        title="Confirmer la sortie"
        message="Es-tu sûr de vouloir quitter la famille ? Cette action est irréversible."
      />
    </Container>
  );
};

export default FamilyProfile;
