// File Name: FamilyCard.tsx
// Developer: @yannick-leguennec (GitHub username)

import React from 'react';
import { Card, Flex, Image, Text, Button, Container } from '@mantine/core'; // importez les composants nécessaires
import classes from './FamilyCard.module.scss';
import { Family } from '@/@types/family';
import icon from '../../../public/img/FF_icon_family.png';

interface FamilyCardProps {
  family: Family;
  onViewProfile: (familyId: number) => void;
}

function FamilyCard({ family, onViewProfile }: FamilyCardProps) {
  return (
    <Card className={`${classes.card}`} withBorder>
      <Image
        src={family.image_url ? family.image_url : icon}
        alt={family.name}
        className={`${classes.card_image}`}
      />
      <Container className={`${classes.card_name}`}>
        <Text className={`${classes.card_text}`}>{family.name}</Text>
      </Container>
      {/* <Container style={{ flexGrow: 1 }} w={100}>
          <Flex justify="flex-start" align="center">
            <Text size="sm" style={{ color: 'dimmed' }}>
              {family.description && family.description.length > 15
                ? `${family.description.substring(0, 15)}...`
                : family.description}
            </Text>
          </Flex>
        </Container> */}
      <Button
        className={`gradientButton ${classes.card_button}`}
        type="button"
        onClick={() => onViewProfile(family.id)}
        size="responsive"
        radius="xl"
      >
        Voir profil
      </Button>
    </Card>
  );
}

export default FamilyCard;

/* Manual of integration of the component in the application
1) import the component in the file where you want to use it : import FamilyCard from '../FamilyCard/FamilyCard';
2) use the component in the JSX code : <FamilyCard key={family.id} family={family} onViewProfile={handleViewProfile} />
*/
