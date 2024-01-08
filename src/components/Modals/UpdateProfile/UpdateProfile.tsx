// UpdateProfile.tsx
// Developer: @yannick-leguennec

import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Group,
    InputLabel,
    Modal,
    PasswordInput,
    Text,
    TextInput,
    rem,
    Flex,
    Title,
    Textarea,
  } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useUser } from '../../../context/UserInfoContext/UserInfoContext';
import { UserData } from '../../../@types/user';
import AlertModal from '../AlertModal/AlertModal';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../../hooks/useHandleSuccess/useHandleSuccess';

// Module CSS personnalisé pour le style
import classes from './UpdateProfile.module.scss';

// Types pour les props et les valeurs de formulaire
interface UpdateProfileProps {
  opened: boolean;
  close: () => void;
  userInfo: UserData;
  setUser: (value: React.SetStateAction<UserData | null>) => void;
}

interface FormValues {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
  description: string;
  birthday: Date | null;
}

function UpdateProfile({ userInfo, opened, close, setUser }: UpdateProfileProps) {
  // États locaux pour la gestion du fichier image, erreurs, et aperçu
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  dayjs.extend(utc);

  // Hooks personnalisés pour la gestion des erreurs et des succès
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  // Afficher l'image existante comme aperçu si elle existe
  useEffect(() => {
    if (userInfo.image_url) {
      setImagePreview(userInfo.image_url);
    }
  }, [userInfo.image_url]);

  // Couleur d'entête du modal
  const headerColor = '#6bd3d4';

  // Accès aux données de l'utilisateur actuel
  const user = useUser();

  // Initialisation et validation du formulaire
  const form = useForm<FormValues>({
    initialValues: {
      username: userInfo.username,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      email: userInfo.email,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      description: userInfo.description || '',
      birthday: userInfo.birthday ? dayjs.utc(userInfo.birthday).toDate() : null,

    },
    validate: { /* Logique de validation pour chaque champ */ },
  });

  // Soumission du formulaire
  const handleSubmit = async () => {
    try {
      
      // Requête PUT pour la mise à jour du profil
      const response = await axios.patch(`https://family-flow-api.up.railway.app/users/${user.user.userId}`, {...form.values, image_url: imageFile}, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.user.token}`,
        },
      });

      // Mise à jour de l'état et affichage des informations du l'utilisateur
      setUser(response.data);
      localStorage.setItem('firstName', response.data.firstname);
      close();
      setAlertMessage('Votre profil a été mis à jour avec succès.');
      setIsAlertModalOpen(true);
      handleSuccess(response);
    } catch (error: any) {
      setAlertMessage('Erreur lors de la mise à jour de votre profil.');
      setIsAlertModalOpen(true);
      handleError(error);
      console.log(error);
      
    }
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setFormError('Type de fichier non pris en charge');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setFormError('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }

      setImageFile(file); // Stocker le fichier d'image pour l'envoi
      const imageUrl = URL.createObjectURL(file); // Créer un URL d'aperçu pour l'affichage
      setImagePreview(imageUrl); // Mettre à jour l'état pour l'aperçu
    }
  };

  // Gestion de la suppression de l'image
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Révoquer l'URL pour libérer les ressources
      setImagePreview(null); // Réinitialiser l'aperçu d'image
    }
  };

  // Structure du composant Modal
  return (
    <>
    <Modal.Root
        opened={opened}
        onClose={close}
        centered
        className="modal"
        size="auto"
      >
        <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
        <Modal.Content>
          <Modal.Header style={{ background: headerColor, color: 'white' }}>
            <Modal.Title>Modifier le profil</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body m={10}>
            <Box className="update-profile">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  radius="xl"
                  label="Pseudo"
                  placeholder="pseudo"
                  {...form.getInputProps('username')}
                />
                <TextInput
                  radius="xl"
                  mt="md"
                  label="Prénom"
                  placeholder="prénom"
                  {...form.getInputProps('firstname')}
                />
                <TextInput
                  radius="xl"
                  mt="md"
                  label="Nom"
                  placeholder="nom"
                  {...form.getInputProps('lastname')}
                />
                <TextInput
                  radius="xl"
                  mt="md"
                  label="Email"
                  placeholder="email"
                  {...form.getInputProps('email')}
                />
                <DatePickerInput
                  radius="xl"
                  mt="md"
                  label="Date de naissance"
                  {...form.getInputProps('birthday')}
                />
                <Textarea
                  radius="xl"
                  mt="md"
                  label="Description"
                  placeholder="Description"
                  {...form.getInputProps('description')}
                />
                <InputLabel mt="md">Image de profil</InputLabel>
                <Dropzone
                  className="input dropbox"
                  onDrop={handleFileUpload}
                  onReject={() => setFormError('Fichier rejeté')}
                  maxSize={3 * 1024 ** 2}
                  // todo : Reactivate it when DB ready to handle picture
                  disabled={!!imagePreview}
                  // disabled
                  accept={IMAGE_MIME_TYPE}
                  mb={20}
                >
                  {!imagePreview && ( // Conditionner l'affichage des icônes uniquement si aucun aperçu d'image n'est présent
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      style={{ pointerEvents: 'none' }}
                    >
                      <Dropzone.Accept>
                        <IconUpload
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: 'var(--mantine-color-blue-6)',
                          }}
                          stroke={1.5}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: 'var(--mantine-color-red-6)',
                          }}
                          stroke={1.5}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: 'var(--mantine-color-dimmed)',
                          }}
                          stroke={1.5}
                        />
                      </Dropzone.Idle>
                      <Flex
                        direction="column"
                        justify="center"
                        align="center"
                        gap={10}
                      >
                        <Text size="lg" inline>
                          Télécharger votre photo
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Seulement les fichiers PNG et JPEG sont autorisés
                        </Text>
                      </Flex>
                    </Group>
                  )}
                  {imagePreview && (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        style={{
                          maxWidth: '75%', // ou une valeur fixe comme 300px
                          maxHeight: '75%', // ou une valeur fixe comme 200px
                          objectFit: 'contain', // Assure que tout l'image est visible
                        }}
                      />
                    </div>
                  )}
                </Dropzone>
                {imagePreview && (
                  <Flex justify="center">
                    <Button
                      className="outlineButton"
                      onClick={handleRemoveImage}
                      style={{ marginTop: '10px' }}
                      m={10}
                      w={175}
                      size="auto"
                      radius="xl"
                    >
                      Supprimer l&apos;image
                    </Button>
                  </Flex>
                )}
                <Flex justify="center">
                  <Title order={3} mt="xl">
                    Changer le mot de passe
                  </Title>
                </Flex>
                <PasswordInput
                  radius="xl"
                  mt="md"
                  label="1) Entrez votre mot de passe actuel"
                  placeholder="Entrez votre mot de passe actuel"
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  radius="xl"
                  mt="md"
                  label="2) Entrez votre nouveau mot de passe"
                  placeholder="Nouveau mot de passe"
                  {...form.getInputProps('newPassword')}
                />
                <PasswordInput
                  radius="xl"
                  mt="md"
                  label="3) Confirmez votre nouveau mot de passe"
                  placeholder="Confirmer votre nouveau mot de passe"
                  {...form.getInputProps('confirmNewPassword')}
                />
                <Flex justify="center">
                  <Button
                    mt={30}
                    radius="xl"
                    type="submit"
                    className="gradientButton update-profile_button-right"
                  >
                    Valider
                  </Button>
                </Flex>
              </form>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <AlertModal
        opened={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title="Confirmation"
        buttonText="Retour"
        redirectTo="/my-profile"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
    </>
      );
    }
    
    export default UpdateProfile;