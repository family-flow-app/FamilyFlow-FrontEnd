// File: FamilyProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Group, Image, Text,Title, Flex } from '@mantine/core';
import axios from 'axios';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import MemberPrivateCard from '../../components/MembePrivateCard/MemberPrivateCard';
import { Family } from '../../@types/family';
import { Member } from '../../@types/member';
import familyIcon from '../../public/img/FF_icon_family.png'
import "../../styles/globalStyles.scss";
import "../../styles/buttons.scss";
import classes from "./FamilyProfile.module.scss"

const FamilyProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'informations' | 'members' | 'requests' | 'invitations'>('informations');
  const [familyInfo, setFamilyInfo] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const handleApiError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const familyInfoResponse = await axios.get(`https://family-flow-api.up.railway.app/families/${user.familyId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFamilyInfo(handleSuccess(familyInfoResponse));


        const membersResponse = await axios.get(`https://family-flow-api.up.railway.app/families/${user.familyId}/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(handleSuccess(membersResponse));

        const invitationsResponse = await axios.get(`https://family-flow-api.up.railway.app/invitations/${user.familyId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInvitations(handleSuccess(invitationsResponse));

        const requestsResponse = await axios.get(`https://family-flow-api.up.railway.app/requests/families/${user.familyId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRequests(handleSuccess(requestsResponse));
      } catch (error: any) {
        handleApiError(error);
      }
    };

    fetchData();
  }, [user.familyId, user.token, handleSuccess, handleApiError]);


  // Gestion des clics sur les onglets
  const handleTabClick = (tabName: 'informations' | 'members' |'requests'|'invitations') => {
    setActiveTab(tabName);
  };

  const handleViewProfile = (id: number) => {
    console.log('Redirection vers le profil du membre', id);
    // Logique pour rediriger vers le profil du membre
  };

  console.log("family info",familyInfo?.image_url, familyInfo?.name, familyInfo);

  return (
    <Container className={`container ${classes.mediaContainer}`}>
{familyInfo && (
  <Flex direction={"column"} align={"center"}>
    <Image
          src={familyInfo[0]?.image_url || familyIcon}
          alt="Profile"
          h={250}
          w={250}
          mb={40}
          radius={100}
         /> 
    <Title className={`${classes.primeTitle}`}>{familyInfo[0]?.name}</Title>
  </Flex>
)}  
      <Group>
        <Button onClick={() => handleTabClick('informations')} w={125}>Informations</Button>
        <Button onClick={() => handleTabClick('members')}w={125}>Membres</Button>
        <Button onClick={() => handleTabClick('requests')}w={125}>Requêtes</Button>
        <Button onClick={() => handleTabClick('invitations')}w={125}>Invitations</Button>

      </Group>
      {activeTab === 'informations' && (
        <>
        <Title order={3} mt={5} mb={5}>
        {familyInfo && (familyInfo[0]?.description ?? 'Non spécifiée')}
      </Title>
      <Text>Existe depuis le: {familyInfo && (familyInfo[0]?.created_at ?? 'Non spécifié')}</Text>
      <Text> Administrateur(s): </Text>
      </>
        )
      }
      {activeTab === 'members' && (
        members.map(member => (
          <MemberPrivateCard key={member.id} member={member} onViewProfile={handleViewProfile} />
        ))
      )}
      {activeTab === 'requests' && (
        requests.map(request => (
          <div key={request.id}>{/* Logique pour afficher les requêtes */}</div>
        ))
      )}
      {activeTab === 'invitations' && (
        invitations.map(invitation => (
        <div key={invitation.id}>{/* Logique pour afficher les invitations */}</div>
        ))
      )}
    </Container>
  );
};

export default FamilyProfile;
