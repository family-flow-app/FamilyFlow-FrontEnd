// File Name: MainUser.tsx
// Developer: @yannick-leguennec (GitHub username)

import React, { useState } from 'react';
import {
  Title,
  Button,
  Group,
  Text,
  Autocomplete,
  rem,
  Flex,
  Container,
  Image,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import '../../styles/globalStyles.scss';
import classes from './MainUser.module.scss';
import '../../styles/buttons.scss';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';
import FamilyCard from '../../components/Cards/FamilyCard/FamilyCard';
import { Family } from '../../@types/family';
import FamilyPublicProfileModal from '../../components/Modals/FamilyPublicProfilModal/FamilyPublicProfilModal';
import icon_family from '../../public/img/FF_icon_family.png';

function MainUser() {
  // State management for UI and data
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [resultCount, setResultCount] = useState(0);

  // Custom hooks for user management and error handling
  const { user } = useUser();
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  // Function to handle family search
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.get(
        `https://family-flow-api.up.railway.app/families?name=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      handleSuccess(response);
      setFamilies(response.data);
      setResultCount(response.data.length); // Mettre à jour le nombre de résultats
      setErrorMessage(null); // Assurez-vous de réinitialiser le message d'erreur si la requête est réussie
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Aucun résultat ne correspond à votre recherche.');
      } else {
        handleError(error);
      }
    }
    setLoading(false);
  };

  // Function to reset search and associated states
  const handleClearSearch = () => {
    setSearchTerm('');
    setFamilies([]);
    setCurrentFamily(null);
    setModalOpened(false);
    setErrorMessage(null);
    setResultCount(0);
  };

  // Function to display a specific family profile
  const handleViewProfile = (familyId: number) => {
    const selectedFamily = families.find((family) => family.id === familyId);
    console.log(selectedFamily);

    if (selectedFamily) {
      setCurrentFamily(selectedFamily);
      setModalOpened(true);
    }
  };

  // Function to handle request to join a family
  const handleRequest = async (familyId: number | undefined) => {
    if (!familyId) return;
    try {
      const response = await axios.post(
        `https://family-flow-api.up.railway.app/requests`,
        {
          family_id: familyId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      handleSuccess(response);
      setAlertMessage('Votre demande pour rejoindre la famille a bien été envoyée !');
      setAlertModalOpened(true);
    } catch (error: any) {
      handleError(error);
    }
  };

  // Generate cards for families
  const familyCard = families.map((family) => (
    <FamilyCard key={family.id} family={family} onViewProfile={handleViewProfile} />
  ));

  return (
    <Container
      className={`container ${classes.mediaContainer} }`}
      // style={customStyle}
    >
      <Flex justify="center">
        <Image src={icon_family} alt="family" className={`${classes.image}`} />
      </Flex>
      <Title mb={25} className={`${classes.primeTitle}`}>
        Trouvez votre famille
      </Title>
      <Group className={`${classes.searchContainer}`}>
        <Autocomplete
          className={`${classes.searchBar}`}
          placeholder="Recherchez..."
          leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
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
      {/* Affichage du message sur le nombre de résultats */}
      {resultCount > 0 && (
        <Flex justify="center" mt={20}>
          <Text>{`${resultCount} résultat${resultCount > 1 ? 's' : ''} trouvé${
            resultCount > 1 ? 's' : ''
          }`}</Text>
        </Flex>
      )}
      {/* Display error message */}
      {errorMessage && (
        <Flex justify="center" mt={20}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
        </Flex>
      )}{' '}
      {/* Family list */}
      <Container size="responsive" p={0}>
        {familyCard}
      </Container>
      {/* Modal for displaying family details */}
      <FamilyPublicProfileModal
        currentFamily={currentFamily}
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        handleRequest={handleRequest}
      />
      <AlertModal
        opened={alertModalOpened}
        onClose={() => {
          setModalOpened(false);
          setAlertModalOpened(false);
        }}
        title="Confirmation"
        buttonText="Retour"
        redirectTo="/main"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
    </Container>
  );
}

export default MainUser;
