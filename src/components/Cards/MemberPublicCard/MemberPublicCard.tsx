// File Name: MemberCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { Image, Text, Card, Flex, Button } from '@mantine/core'; // importez les composants nécessaires
import axios from 'axios';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { Member } from '@/@types/member';
import classes from './MemberPublicCard.module.scss';
import icon from '../../../public/img/FF_icon_member.png';

interface MemberCardProps {
  member: Member;
  activity_id: Number | null;
}

function MemberPublicCard({ member, activity_id }: MemberCardProps): React.ReactElement<{ member: Member }> {
  const { user } = useUser();

  const handleLeaveActivity = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/activities/${activity_id}/user/${member.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card className={classes.card} withBorder>
      <Flex justify="space-around" align="center">
        <Image
          className={`${classes.card_image}`}
          src={member.image_url ? member.image_url : icon}
          alt={`${member.firstname} ${member.lastname}`}
        />
        <div style={{ marginLeft: '20px' }}>
          <Text className={`${classes.card_text}`}>{`${member.firstname} ${member.lastname}`}</Text>
          { member.id === user.userId &&
          <Button onClick={handleLeaveActivity}>Ne plus participer</Button>
          }
        </div>
      </Flex>
    </Card>
  );
}

export default MemberPublicCard;

/* Manual of integration of the component in the application
1) Import the component in the file where you want to use it: import MemberPublicCard from './MemberPublicCard/MemberPublicCard';
2) Use the component in the render function: <MemberPublicCard key={member.id} member={member} />
*/
