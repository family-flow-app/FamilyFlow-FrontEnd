import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Title,
  Text,
  Flex,
  Group,
  Button,
  Textarea,
  Modal,
  Box,
  InputLabel,
  MultiSelect,
  rem,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import AlertModal from '@/components/Modals/AlertModal/AlertModal';
import axios from 'axios';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import { useForm } from '@mantine/form';
import { Family } from '@/@types/family';
import { UserData } from '@/@types/user';

interface UpdateFamilyProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onFamilyInfoUpdate: () => void;
  familyInfos: Family;
}

interface formValues {
  name: string;
  description: string;
  admin?: number[];
}

interface Member {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
}

const UpdateFamilyProfileModal = ({
  familyInfos,
  opened,
  onClose,
  onFamilyInfoUpdate,
}: UpdateFamilyProfileModalProps) => {
  const [isDescriptionTouched, setDescriptionTouched] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAlertModalOpened, setIsAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [members, setMembers] = useState<Member[]>([]); // Stocke tous les membres
  const [selectedAdmin, setSelectedAdmin] = useState<number[]>([]); // Stocke les ID des admins sélectionnés
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();

  // Couleur d'entête du modal
  const headerColor = '#6bd3d4';

  const form = useForm<formValues>({
    initialValues: {
      name: familyInfos.name,
      description: familyInfos?.description || 'Dites-en plus sur votre famille',
      //   TODO TO ACTIVATE WHEN API IS READY
      //   admin: [],
    },

    validate: {
      name: (value) => {
        if (!value.trim()) return 'Veuillez entrer un nom de famille';
        if (!/^[a-zA-Z0-9 ]+$/.test(value))
          return 'Le pseudo ne doit contenir que des lettres et des chiffres';
        return null;
      },
      description: (value) => {
        if (!isDescriptionTouched) {
          return null; // Ne pas valider tant que l'utilisateur n'a pas touché le champ
        }
        return value && value.length <= 500
          ? null
          : 'La description ne doit pas dépasser 500 caractères';
      },
    },
  });

  //   TODO TO ACTIVATE WHEN API IS READY
  //   useEffect(() => {
  //     const fetchMembers = async () => {
  //       try {
  //         const response = await axios.get(
  //           `https://family-flow-api.up.railway.app/families/${user.familyId}/users`,
  //           {
  //             headers: { Authorization: `Bearer ${user.token}` },
  //           }
  //         );
  //         setMembers(response.data);

  //         // Pré-sélection des administrateurs
  //         const adminIds = response.data
  //           .filter((member: Member) => member.role === 'admin')
  //           .map((admin: Member) => admin.id);
  //         setSelectedAdmin(adminIds);
  //       } catch (error: any) {
  //         handleError(error);
  //       }
  //     };

  //     fetchMembers();
  //   }, [user.familyId, user.token]);

  // Afficher l'image existante comme aperçu si elle existe
  useEffect(() => {
    if (familyInfos.image_url) {
      setImagePreview(familyInfos.image_url);
    }
  }, [familyInfos.image_url]);

  // Function to handle file upload
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

  // Function to handle image removal
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Révoquer l'URL pour libérer les ressources
      setImagePreview(null); // Réinitialiser l'aperçu d'image
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    // TODO TO ACTIVATE WHEN API IS READY
    // Vérifie si aucun administrateur n'est sélectionné
    // if (selectedAdmin.length === 0) {
    //   setFormError('* Au moins un administrateur est requis');
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append('name', form.values.name);
      formData.append('description', form.values.description);
      if (imageFile) {
        formData.append('image_url', imageFile);
      }

      //   TODO TO ACTIVATE WHEN API IS READY
      //   formData.append('admin', selectedAdmin.toString());

      const response = await axios.put(
        `https://family-flow-api.up.railway.app/families/${user.familyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setAlertMessage('Le profil de la famille a été mis à jour avec succès.');
      setIsAlertModalOpened(true);
      handleSuccess(response);
      onFamilyInfoUpdate();
      onClose();
    } catch (error: any) {
      handleError(error);
      setAlertMessage('Erreur lors de la mise à jour du profil de la famille.');
      setIsAlertModalOpened(true);
    }
  };

  return (
    <>
      <Modal.Root opened={opened} onClose={onClose} centered className="modal" size="auto">
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
                  label="Nom de famille"
                  placeholder="pseudo"
                  {...form.getInputProps('name')}
                  required
                  mb={15}
                />
                {/* To ACTIVATE WHEN API READY */}
                {/* <MultiSelect
                  data={members.map((member) => ({
                    value: member.id?.toString(),
                    label: `${member.firstname} ${member.lastname}`,
                  }))}
                  value={selectedAdmin.map(String)}
                  onChange={(selectedValues) => setSelectedAdmin(selectedValues.map(Number))}
                  checkIconPosition="right"
                  withScrollArea={false}
                  label="Administrateurs"
                  searchable
                  clearable
                  radius="xl"
                  mb={15}
                />
                <Text style={{ color: 'red' }} size="sm">
                  {formError}
                </Text> */}
                <Textarea
                  radius="xl"
                  mt="md"
                  label="Description"
                  placeholder="Description"
                  {...form.getInputProps('description')}
                />

                <InputLabel mt="md">Photo de famille</InputLabel>
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
                        alt="profil picture preview"
                        style={{
                          maxWidth: '500px',
                          maxHeight: '500px',
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
                      w={175}
                      size="auto"
                      radius="xl"
                    >
                      Supprimer l&apos;image
                    </Button>
                  </Flex>
                )}
                <Flex justify="center">
                  <Button type="submit" className="gradientButton" radius="xl" m={10}>
                    Soumettre
                  </Button>
                </Flex>
              </form>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <AlertModal
        opened={isAlertModalOpened}
        onClose={() => setIsAlertModalOpened(false)}
        title="Confirmation"
        buttonText="Retour"
        redirectTo="/my-family"
      >
        <Text>{alertMessage}</Text>
      </AlertModal>
    </>
  );
};

export default UpdateFamilyProfileModal;
