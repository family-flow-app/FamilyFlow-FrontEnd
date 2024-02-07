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
import { DatePickerInput, DatesProvider } from '@mantine/dates';
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
      birthday: userInfo.birthday ? new Date(userInfo.birthday) : null,
    },
    validate: {
      username: (value) => {
        if (!value.trim()) return 'Le pseudo est requis';
        if (!/^[a-zA-Z0-9]+$/.test(value))
          return 'Le pseudo ne doit contenir que des lettres et des chiffres';
        return null;
      },
      firstname: (value) => {
        if (!value.trim()) return 'Le nom est requis';
        if (!/^[a-zA-Z\u00C0-\u00FF ']+$/.test(value))
          return 'Le nom ne doit contenir que des lettres, des lettres accentuées et des espaces';
        return null;
      },
      lastname: (value) => {
        if (!value.trim()) return 'Le prénom est requis';
        if (!/^[a-zA-Z\u00C0-\u00FF ']+$/.test(value))
          return 'Le prénom ne doit contenir que des lettres, des lettres accentuées et des espaces';
        return null;
      },
      email: (value) => {
        if (!value.trim()) return 'Le champ email est requis';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Email invalide';
        }
        return null;
      },
      description: (value) => {
        return value.length <= 500 ? null : 'La description ne doit pas dépasser 500 caractères';
      },
      password: (value) => {
        if (value.length < 8) return 'Le mot de passe actuel doit contenir au moins 8 caractères';
        if (!/[A-Z]/.test(value))
          return 'Le mot de passe actuel doit contenir au moins une lettre majuscule';
        if (!/[a-z]/.test(value))
          return 'Le mot de passe actuel doit contenir au moins une lettre minuscule';
        if (!/[\W_]/.test(value))
          return 'Le mot de passe actuel doit contenir au moins un caractère spécial';
        return null;
      },
      newPassword: (value, values) => {
        if (value.length < 8) return 'Le nouveau mot de passe doit contenir au moins 8 caractères';
        if (!/[A-Z]/.test(value))
          return 'Le nouveau mot de passe doit contenir au moins une lettre majuscule';
        if (!/[a-z]/.test(value))
          return 'Le nouveau mot de passe doit contenir au moins une lettre minuscule';
        if (!/[\W_]/.test(value))
          return 'Le nouveau mot de passe doit contenir au moins un caractère spécial';
        if (value === values.password)
          return "Le nouveau mots de passe ne peut pas être le même que l'ancien";
        return null;
      },
      confirmNewPassword: (value, values) => {
        if (value !== values.newPassword) return 'Les nouveaux mots de passe ne correspondent pas';
        return null;
      },
    },
  });

  // Soumission du formulaire
  const handleSubmit = async () => {
    const { password, newPassword, confirmNewPassword } = form.values;

    // // Vérifie si l'utilisateur a tenté de changer son mot de passe
    // if (password || newPassword || confirmNewPassword) {
    //   // Vérifie si tous les champs nécessaires sont remplis
    //   if (!password || !newPassword || !confirmNewPassword) {
    //     setFormError(
    //       'Veuillez remplir tous les champs de mot de passe pour changer votre mot de passe.'
    //     );
    //     return; // Empêche la soumission du formulaire
    //   }
    //   // Vérifie si le nouveau mot de passe et la confirmation correspondent
    //   if (newPassword !== confirmNewPassword) {
    //     setFormError('Le nouveau mot de passe et la confirmation ne correspondent pas.');
    //     return; // Empêche la soumission du formulaire
    //   }
    // }

    try {
      const filteredFormValues = Object.fromEntries(
        Object.entries(form.values).filter(([key, value]) => value !== '' && value !== null)
      );

      if (filteredFormValues.birthday) {
        filteredFormValues.birthday = dayjs.utc(filteredFormValues.birthday).format('YYYY/MM/DD');
      }

      const updatedData = {
        ...filteredFormValues,
        image_url: imageFile, // Inclus l'image seulement si nécessaire
      };
      console.log('updated data', updatedData);

      // Requête PATCH pour la mise à jour du profil
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_API_URL}/users/${user.user.userId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.user.token}`,
          },
        }
      );

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

  const handleBlur = (fieldName: string) => {
    form.validateField(fieldName);
  };

  // Structure du composant Modal
  return (
    <>
      <Modal.Root opened={opened} onClose={close} centered className="modal" size="auto">
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
                  required
                />
                <TextInput
                  radius="xl"
                  mt="md"
                  label="Prénom"
                  placeholder="prénom"
                  {...form.getInputProps('firstname')}
                  required
                />
                <TextInput
                  radius="xl"
                  mt="md"
                  label="Nom"
                  placeholder="nom"
                  {...form.getInputProps('lastname')}
                  required
                />
                <TextInput
                  radius="xl"
                  mt="md"
                  label="Email"
                  placeholder="email"
                  {...form.getInputProps('email')}
                  required
                />
                <DatesProvider settings={{ timezone: 'UTC' }}>
                  <DatePickerInput
                    radius="xl"
                    mt="md"
                    label="Date de naissance"
                    {...form.getInputProps('birthday')}
                  />
                </DatesProvider>
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
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
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
                      <Flex direction="column" justify="center" align="center" gap={10}>
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
                        alt="Aperçu de la photo de profil téléchargée"
                        style={{
                          maxWidth: '250px',
                          maxHeight: '250px',
                          objectFit: 'contain',
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
                      w={'auto'}
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
                  onBlur={() => handleBlur('password')}
                />
                <PasswordInput
                  radius="xl"
                  mt="md"
                  label="2) Entrez votre nouveau mot de passe"
                  placeholder="Nouveau mot de passe"
                  {...form.getInputProps('newPassword')}
                  onBlur={() => handleBlur('newPassword')}
                />
                <PasswordInput
                  radius="xl"
                  mt="md"
                  label="3) Confirmez votre nouveau mot de passe"
                  placeholder="Confirmer votre nouveau mot de passe"
                  {...form.getInputProps('confirmNewPassword')}
                  onBlur={() => handleBlur('confirmNewPassword')}
                />
                <Flex justify="center">
                  <Button
                    mt={30}
                    radius="xl"
                    type="submit"
                    className="gradientButton update-profile_button-right"
                  >
                    Soumettre
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
