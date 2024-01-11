// File Name: MemberPrivateCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Text, Card, Container, ActionIcon } from '@mantine/core'; // importez les composants nécessaires
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { Member } from '@/@types/member';
import { IconUserQuestion, IconX } from '@tabler/icons-react';
import classes from './MemberPrivateCard.module.scss';
import icon from '../../../public/img/FF_icone-task.png';

interface MemberCardProps {
  member: Member;
  onViewProfile: (id: number) => void;
  onExpelMember: (id: number) => void;
}

function MemberPrivateCard({
  member,
  onViewProfile,
  onExpelMember,
}: MemberCardProps): React.ReactElement<{ member: Member }> {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <Card className={classes.card} withBorder>
      <Image
        className={`${classes.card_image}`}
        src={member.image_url ? member.image_url : icon}
        alt={`${member.firstname} ${member.lastname}`}
      />
       
      <Container className={`${classes.card_name}`}>
        <Text className={`${classes.card_text}`}>{`${member.firstname} ${member.lastname}`}</Text>
      </Container>
      {user.userId === member.id ||
        (member.id !== user.userId && (
          <ActionIcon
            color="red"
            type="button"
            size="xl"
            m={5}
            radius="xl"
            onClick={() => onExpelMember(member.id)}
          >
            <IconX />
          </ActionIcon>
        ))}
      {member.id !== user.userId && (
        <ActionIcon
          className={`gradientButton ${classes.card_button}`}
          type="button"
          size="xl"
          mt={5}
          mb={5}
          ml={5}
          radius="xl"
          onClick={() => onViewProfile(member.id)}
        >
          <IconUserQuestion />
        </ActionIcon>
      )}
    </Card>
  );
}

export default MemberPrivateCard;

/* Manual of integration of the component in the application
1) Import the component in the file where you want to use it: import MemberPrivateCard from './MemberPrivateCard/MemberPublicCard';
2) Use the component in the render function: <MemberPrivateCard key={member.id} member={member} onViewProfile={handleViewProfile} />
! ATTENTION THE COMPONENT MUST BE CONNECTED TO A FUNCTION THAT HANDLE THE REDIRECTION TO THE MEMBER PROFILE PAGE, NAMED handleViewProfile IN THE EXAMPLE ABOVE
*/