// File: FamilyProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Group,
  Image,
  Text,
  Title,
  Flex,
  Autocomplete,
  rem,
} from '@mantine/core';
import ConfirmModal from '@/components/Modals/ConfirmModal/ConfirmModal';
import AlertModal from '@/components/Modals/AlertModal/AlertModal';
import UpdateFamilyProfileModal from '@/components/Modals/UpdateFamilyProfileModal/UpdateFamilyProfileModal';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import MemberPrivateCard from '../../components/Cards/MembePrivateCard/MemberPrivateCard';
import UserInvitationCard from '@/components/Cards/UserInvitationCard/UserInvitationCard';
import RequestCard from '@/components/Cards/RequestCard/RequestCard';
import InvitationCard from '@/components/Cards/InvitationCard/InvitationCard';
import { Family } from '../../@types/family';
import { Member } from '../../@types/member';
import familyIcon from '../../public/img/FF_icon_family.png';
import { IconSearch } from '@tabler/icons-react';
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
  const [isUpdateFamilyProfileModalOpen, setIsUpdateFamilyProfileModalOpen] = useState(false);
  const [isInviteConfirmModalOpen, setIsInviteConfirmModalOpen] = useState(false);
  const [selectedUserIdForInvite, setSelectedUserIdForInvite] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isMemberExpulsionConfirmModalOpen, setMemberExpulsionConfirmModalOpen] = useState(false);
  const [isMemberExpulsionAlertModalOpen, setMemberExpulsionAlertModalOpen] = useState(false);
  const [expulsionAlertMessage, setExpulsionAlertMessage] = useState('');
  const [selectedMemberIdForExpulsion, setSelectedMemberIdForExpulsion] = useState<number | null>(
    null
  );

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

  // Fonction pour confirmer l'expulsion d'un membre
  const handleOpenExpulsionConfirmModal = (memberId: number) => {
    setSelectedMemberIdForExpulsion(memberId);
    setMemberExpulsionConfirmModalOpen(true);
  };

  // Fonction pour expulser un membre
  const handleConfirmMemberExpulsion = async () => {
    if (!selectedMemberIdForExpulsion) return;

    try {
      await axios.delete(
        `https://family-flow-api.up.railway.app/families/${user.familyId}/members/${selectedMemberIdForExpulsion}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setExpulsionAlertMessage('Membre expulsé avec succès.');
      setMemberExpulsionAlertModalOpen(true);
      // Actualiser la liste des membres
      await fetchMembers();
    } catch (error) {
      setExpulsionAlertMessage("Erreur lors de l'expulsion du membre.");
      setMemberExpulsionAlertModalOpen(true);
    }
    setMemberExpulsionConfirmModalOpen(false);
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

  // Fonction permettant de rafraîchir les invitations
  const refreshInvitations = async () => {
    console.log('Rafraîchissement des invitations...');
    await fetchInvitations();
  };

  // Fonction pour gérer la barre de recherche dans l'onglet Invitations
  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);
    try {
      const response = await axios.get(
        `https://family-flow-api.up.railway.app/users?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchResults(response.data);
      handleSuccess(response);
    } catch (error: any) {
      handleApiError(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]); // Réinitialiser les résultats
    setSearchTerm(''); // Réinitialiser le terme de recherche
    setSearchPerformed(false); // Indiquer qu'aucune recherche n'est en cours
  };

  // Fonction pour ouvrir la modale de confirmation d'invitation
  const openInviteConfirmModal = (userId: number) => {
    setSelectedUserIdForInvite(userId);
    setIsInviteConfirmModalOpen(true);
  };

  // Fonction pour confirmer l'invitation
  const handleConfirmInvitation = async () => {
    if (selectedUserIdForInvite === null) return;

    try {
      const response = await axios.post(
        'https://family-flow-api.up.railway.app/invitations',
        {
          to_user_id: selectedUserIdForInvite,
          family_id: user.familyId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      handleSuccess(response);
      console.log('Invitation envoyée avec succès !');
      // Actualiser la liste des invitations
      await fetchInvitations();
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsInviteConfirmModalOpen(false);
      setSelectedUserIdForInvite(null);
    }
  };

  // Fonction pour gérer la suppression d'une invitation
  const handleDeleteInvitation = async (invitationId: number) => {
    try {
      const response = await axios.delete(
        `https://family-flow-api.up.railway.app/invitations/${invitationId}/families/${user.familyId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      handleSuccess(response);
      console.log('Invitation supprimée avec succès !');
      await fetchInvitations();
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
    navigate(`/members/${id}`);
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
              className={`${classes.image}`}
              src={familyInfo[0]?.image_url || familyIcon}
              alt="Profile"
            />
            <Title className={`${classes.primeTitle}`} mb={30}>
              {familyInfo[0]?.name}
            </Title>
          </>
        )}
        <Group className={`${classes.separatorBottom}`} pb={20}>
          <Button
            className={`${
              activeTab === 'informations' ? classes.activeTabButton : 'filterButton'
            } ${classes.button}`}
            onClick={() => handleTabClick('informations')}
            radius="xl"
          >
            Informations
          </Button>
          <Button
            className={`${activeTab === 'members' ? classes.activeTabButton : 'filterButton'} ${
              classes.button
            }`}
            onClick={() => handleTabClick('members')}
            radius="xl"
          >
            Membres
          </Button>
          <Button
            className={`${activeTab === 'requests' ? classes.activeTabButton : 'filterButton'} ${
              classes.button
            }`}
            onClick={() => handleTabClick('requests')}
            radius="xl"
          >
            Requêtes
          </Button>
          <Button
            className={`${activeTab === 'invitations' ? classes.activeTabButton : 'filterButton'} ${
              classes.button
            }`}
            onClick={() => handleTabClick('invitations')}
            radius="xl"
          >
            Invitations
          </Button>
        </Group>
        {activeTab === 'informations' && (
          <>
            <Title className={`${classes.subtitle}`} order={2} mt={30} mb={5}>
              Informations
            </Title>
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
            <Group className={`${classes.buttonGroup}`}>
              <Button
                className="gradientButton"
                w={160}
                onClick={() => setIsUpdateFamilyProfileModalOpen(true)}
                radius="xl"
              >
                Modifier famille
              </Button>
              <Button className="outlineButton" w={160} onClick={openConfirmModal} radius="xl">
                Quitter famille
              </Button>
              {user.role === 'admin' && (
                <Button
                  className="deleteButton"
                  onClick={() => setIsDeleteModalOpen(true)}
                  radius="xl"
                  w={160}
                >
                  Supprimer famille
                </Button>
              )}
            </Group>
            {familyInfo && familyInfo.length > 0 && (
              <UpdateFamilyProfileModal
                familyInfos={familyInfo[0]}
                members={members}
                opened={isUpdateFamilyProfileModalOpen}
                onClose={() => setIsUpdateFamilyProfileModalOpen(false)}
                onFamilyInfoUpdate={fetchFamilyInfo}
              />
            )}
          </>
        )}
        {activeTab === 'members' && (
          <>
            <Title className={`${classes.subtitle}`} order={2} mt={30} mb={5}>
              Liste des Membres
            </Title>
            <Text mt={20}>{`Nombre de membres: (${members.length})`}</Text>
            {members.map((member) => (
              <MemberPrivateCard
                key={member.id}
                member={member}
                onViewProfile={handleViewProfile}
                onExpelMember={handleOpenExpulsionConfirmModal}
              />
            ))}
            <ConfirmModal
              opened={isMemberExpulsionConfirmModalOpen}
              onClose={() => setMemberExpulsionConfirmModalOpen(false)}
              onConfirm={handleConfirmMemberExpulsion}
              onCancel={() => setMemberExpulsionConfirmModalOpen(false)}
              title="Expulser le membre"
              message="Es-tu sûr de vouloir expulser ce membre ?"
            />
            <AlertModal
              opened={isMemberExpulsionAlertModalOpen}
              onClose={() => setMemberExpulsionAlertModalOpen(false)}
              title="Alerte"
              buttonText="OK"
              redirectTo="/my-family"
            >
              {expulsionAlertMessage}
            </AlertModal>
          </>
        )}
        {activeTab === 'requests' && (
          <>
            <Title className={`${classes.subtitle}`} order={2} mt={30} mb={5}>
              Requêtes
            </Title>
            {requests.map(
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
          </>
        )}

        {activeTab === 'invitations' && (
          <>
            <Title className={`${classes.subtitle}`} order={2} mt={30} mb={5}>
              Invitations
            </Title>
            <Title className={`${classes.subtitle}`} order={3} mt={10} mb={20}>
              Recherche un nouveau membre
            </Title>
            <Group className={`${classes.searchContainer}`}>
              <Autocomplete
                className={`${classes.searchBar}`}
                placeholder="Recherchez..."
                leftSection={
                  <IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                data={[]} // Initialize with real data
                onChange={setSearchTerm}
                value={searchTerm}
                radius="xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Group>
                <Button
                  className={`gradientButton ${classes.button}`}
                  onClick={handleSearch}
                  loading={loading}
                  size="responsive"
                  radius="xl"
                >
                  Chercher
                </Button>
                <Button
                  onClick={handleClearSearch}
                  className={`outlineButton ${classes.button}`}
                  size="responsive"
                  radius="xl"
                >
                  Clear
                </Button>
              </Group>
            </Group>
            <>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <UserInvitationCard key={user.id} user={user} onInvite={openInviteConfirmModal} />
                ))
              ) : searchPerformed ? (
                <Text style={{ color: 'red' }} m={5}>
                  <strong>Aucun résultat trouvé.</strong>
                </Text>
              ) : null}
            </>
            <Title className={`${classes.subtitle}`} order={3} mt={20} mb={20}>
              Invitations envoyées
            </Title>
            <Text mt={20}>{`Nombre d'invitations envoyées: (${invitations.length})`}</Text>
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onDelete={handleDeleteInvitation}
                refreshInvitations={refreshInvitations}
              />
            ))}
          </>
        )}
      </Flex>
      <ConfirmModal
        opened={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmFamilyExit}
        onCancel={closeConfirmModal}
        title="Confirmer la sortie"
        message="Es-tu sûr de vouloir quitter la famille ? Cette action est irréversible."
      />
      <ConfirmModal
        opened={isInviteConfirmModalOpen}
        onClose={() => setIsInviteConfirmModalOpen(false)}
        onConfirm={handleConfirmInvitation}
        onCancel={() => setIsInviteConfirmModalOpen(false)}
        title="Inviter un utilisateur"
        message="Es-tu sûr de vouloir inviter cet utilisateur à rejoindre ta famille ?"
      />
      <ConfirmModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteFamily}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Supprimer la famille"
        message="Es-tu sûr de vouloir supprimer la famille ? Cette action est irréversible."
      />
    </Container>
  );
};

export default FamilyProfile;
