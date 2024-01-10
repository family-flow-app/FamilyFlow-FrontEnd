import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextInput,
  Title,
  Text,
  Flex,
  Group,
  Button,
  rem,
  Textarea,
} from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import AlertModal from '@/components/Modals/AlertModal/AlertModal';
import axios from 'axios';
import useApiErrorHandler from '@/hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '@/hooks/useHandleSuccess/useHandleSuccess';
import { useUser } from '@/context/UserInfoContext/UserInfoContext';
import globalClasses from '../../styles/globalStyles.scss';
import classes from './CreateFamily.module.scss';
import { useForm } from '@mantine/form';

interface formValues {
  name: string;
  description: string;
}

const CreateFamily = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDescriptionTouched, setDescriptionTouched] = useState(false);
  const [alertModalOpened, setAlertModalOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { user, setUser } = useUser();
  const handleError = useApiErrorHandler();
  const handleSuccess = useHandleSuccess();
  const navigate = useNavigate();

  const form = useForm<formValues>({
    initialValues: {
      name: '',
      description: '',
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

  // Function to handle field blur event and validate field
  const handleBlur = (fieldName: string) => {
    form.validateField(fieldName);
  };

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
    // Valider tous les champs du formulaire
    const formIsValid = form.validate().hasErrors;
    if (formIsValid) {
      return;
    }
    try {
      // Créer un objet FormData pour l'envoi de fichiers
      const formData = new FormData();
      Object.entries(form.values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imageFile) {
        formData.append('image_url', imageFile);
      }

      // Envoyer la requête POST
      const response = await axios.post(
        'https://family-flow-api.up.railway.app/families',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Gérer la réponse positive
      const { role, family } = response.data;
      localStorage.setItem('role', role);
      localStorage.setItem('family_id', family.id);
      setUser({
        ...user,
        familyId: family.id,
        role: role,
      });
      //   handleSuccess(response);
      console.log('Famille créée avec succès');
      //   setIsSuccess(true);
      //   setAlertMessage('Votre famille a bien été créée.');
      //   setAlertModalOpened(true);
    } catch (error: any) {
      handleError(error);
      setIsSuccess(false);
      setAlertMessage('Erreur lors de la création de la famille.');
      setAlertModalOpened(true);
    }
  };

  useEffect(() => {
    console.log('isSuccess changed:', isSuccess);
  }, [isSuccess]);

  return (
    <Container className={`${classes.mediaContainer}`}>
      <Title className={`${classes.primeTitle}`} mt={40} mb={40}>
        Créer une famille
      </Title>
      <Text mt={10} mb={10} fw={600}>
        Nom de famille:{' '}
      </Text>
      <TextInput
        placeholder="Nom de la famille"
        radius={100}
        {...form.getInputProps('name')}
        required
      />
      <Text mt={10} mb={10} fw={600}>
        Description de la famille:{' '}
      </Text>
      <Textarea
        placeholder="Description de la famille"
        radius={100}
        {...form.getInputProps('description')}
        onBlur={() => {
          handleBlur('description');
          setDescriptionTouched(true);
        }}
      />
      <Text mt={10} mb={10} fw={600}>
        Photo de la famille
      </Text>
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
                maxWidth: '100%',
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
            w={160}
            size="auto"
            radius="xl"
          >
            Supprimer l&apos;image
          </Button>
        </Flex>
      )}
      {formError && (
        <Text style={{ color: 'red', alignContent: 'center' }} size="sm">
          {formError}
        </Text>
      )}
      <Flex justify="center">
        <Button
          onClick={() => navigate('/main')}
          className="outlineButton"
          m={10}
          w={100}
          size="responsive"
          radius="xl"
        >
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          className="gradientButton"
          m={10}
          w={100}
          size="responsive"
          radius="xl"
        >
          Envoyer
        </Button>
      </Flex>
      <AlertModal
        opened={alertModalOpened}
        onClose={() => setAlertModalOpened(false)}
        title="Confirmation"
        buttonText={isSuccess ? 'Continuer' : 'Retour'}
        redirectTo={isSuccess ? '/main' : '/create-family'}
      >
        {alertMessage}
      </AlertModal>
    </Container>
  );
};

export default CreateFamily;
