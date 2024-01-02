// File Name: MemberCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { Image, Text, Card, Button, Container } from '@mantine/core'; // importez les composants nécessaires
import { Member } from '../../@types/member';
import classes from './MemberPublicCard.module.scss';
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
      <Container className={`${classes.card_header}`}>
        <Image
          className={`${classes.card_image}`}
          src={member.image_url ? member.image_url : icon}
          alt={`${member.firstname} ${member.lastname}`}
        />
        <div style={{ marginLeft: '20px' }}>
          <Text className={`${classes.card_text}`}>
            {`${member.firstname} ${member.lastname}`}
          </Text>
        </div>
      </Container>
      <Container>
        <Button
          className="gradientButton"
          type="button"
          w={100}
          m={10}
          size="responsive"
          radius="xl"
          onClick={() => onViewProfile(member.id)}
        >
          Voir profil
        </Button>
      </Container>
    </Card>
  );
}

export default MemberPrivateCard;

/* Manual of integration of the component in the application
1) Import the component in the file where you want to use it: import MemberPrivateCard from './MemberPrivateCard/MemberPublicCard';
2) Use the component in the render function: <MemberPrivateCard key={member.id} member={member} onViewProfile={handleViewProfile} />
! ATTENTION THE COMPONENT MUST BE CONNECTED TO A FUNCTION THAT HANDLE THE REDIRECTION TO THE MEMBER PROFILE PAGE, NAMED handleViewProfile IN THE EXAMPLE ABOVE
*/
