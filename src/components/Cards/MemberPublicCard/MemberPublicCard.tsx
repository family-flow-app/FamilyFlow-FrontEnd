// File Name: MemberCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { Image, Text, Card, Flex } from '@mantine/core'; // importez les composants nécessaires
import { Member } from '@/@types/member';
import classes from './MemberPublicCard.module.scss';
import icon from '../../../public/img/FF_icon_member.png';

interface MemberCardProps {
  member: Member;
  activity_id?: number;
}

function MemberPublicCard({
  member,
  activity_id,
}: MemberCardProps): React.ReactElement<{ member: Member }> {
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
