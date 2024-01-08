// File Name: MemberCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { Image, Text, Card, Button, Container } from '@mantine/core'; // importez les composants nécessaires
import { Member } from '../../@types/member';
import classes from './MemberPrivateCard.module.scss';
import icon from '../../public/img/FF_icone-task.png';

interface MemberCardProps {
  member: Member;
  onViewProfile: (id: number) => void;
}

function MemberPrivateCard({
  member,
  onViewProfile,
}: MemberCardProps): React.ReactElement<{ member: Member }> {
  return (
    <Card className={classes.card} withBorder>
        <Image
          className={`${classes.card_image}`}
          src={member.image_url ? member.image_url : icon}
          alt={`${member.firstname} ${member.lastname}`}
        />
         <Container className={`${classes.card_name}`}>
          <Text className={`${classes.card_text}`}>
            {`${member.firstname} ${member.lastname}`}
          </Text>
        </Container>
        <Button
          className={`gradientButton ${classes.card_button}`}
          type="button"
          m={10}
          size="auto"
          radius="xl"
          onClick={() => onViewProfile(member.id)}
        >
          Voir profil
        </Button>
    </Card>
  );
}

export default MemberPrivateCard;

/* Manual of integration of the component in the application
1) Import the component in the file where you want to use it: import MemberPrivateCard from './MemberPrivateCard/MemberPublicCard';
2) Use the component in the render function: <MemberPrivateCard key={member.id} member={member} onViewProfile={handleViewProfile} />
! ATTENTION THE COMPONENT MUST BE CONNECTED TO A FUNCTION THAT HANDLE THE REDIRECTION TO THE MEMBER PROFILE PAGE, NAMED handleViewProfile IN THE EXAMPLE ABOVE
*/
