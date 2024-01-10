// MemberProfile.tsx
// Developer: @yannick-leguennec

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { Container, Image, Title, Text, Flex } from '@mantine/core';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import iconMember from '../../public/img/FF_icon_member.png';
import { UserData } from '@/@types/user';
import '../../styles/globalStyles.scss';
import classes from './MemberProfile.module.scss';

function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();

  const [memberInfo, setMemberInfo] = useState<UserData | null>(null);
  dayjs.extend(utc);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `https://family-flow-api.up.railway.app/families/${user.familyId}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setMemberInfo(response.data);
      } catch (error) {
        console.error(error);
        // Gérer l'erreur comme souhaité
      }
    };

    fetchMemberData();
  }, [id]);

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
        <Title order={1} className={`${classes.primeTitle}`}>
          {memberInfo?.firstname} {memberInfo?.lastname}
        </Title>
        <Text mb={20}>@{memberInfo?.username}</Text>
        <Title order={3} mt={5} mb={5}>
          {memberInfo?.description ?? 'Non spécifiée'}
        </Title>
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
      </Flex>
    </Container>
  );
}

export default MemberProfile;
