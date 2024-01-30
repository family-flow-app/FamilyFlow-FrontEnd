// File: SignUp.tsx
// Developer: @yannick-leguennec (GitHub ID)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/buttons.scss';
import '../../styles/globalStyles.scss';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Text,
  rem,
  Title,
  PasswordInput,
  Button,
  Checkbox,
  Textarea,
  Group,
  Alert,
  Container,
  Flex,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import classes from './SignUp.module.scss';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';
import useApiErrorHandler from '../../hooks/useApiErrorHandler/useApiErrorHandler';
import useHandleSuccess from '../../hooks/useHandleSuccess/useHandleSuccess';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';

// Defining interface for form values
interface FormValues {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: Date | null;
  description: string | null;
  // image_url: string | null;
  terms: boolean;
}

// SignUp component with DropzoneProps for image upload
function Signup(props: Partial<DropzoneProps>) {
  // State management for various functionalities
  const [isModalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isDescriptionTouched, setDescriptionTouched] = useState(false);

  // Utilisation de hooks React et Mantine
  const navigate = useNavigate();
  const { user } = useUser();

  // Custom hooks for user management and error handling
  const handleSuccess = useHandleSuccess();
  const handleError = useApiErrorHandler();
  // Remplacez ces valeurs par les breakpoints que vous souhaitez utiliser
  const isMobile = useMediaQuery('(max-width: 768px)');

  // useForm hook from Mantine for form management
  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthday: null,
      description: '',
      // image_url: null,
      terms: false,
    },

    // Validation logic for each form field
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
      password: (value) => {
        if (!value.trim()) return 'Le mot de passe est requis';
        if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
        if (!/[A-Z]/.test(value))
          return 'Le mot de passe doit contenir au moins une lettre majuscule';
        if (!/[a-z]/.test(value))
          return 'Le mot de passe doit contenir au moins une lettre minuscule';
        if (!/[\W_]/.test(value))
          return 'Le mot de passe doit contenir au moins un caractère spécial';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value.trim()) return 'La confirmation du mot de passe est requise';
        if (value !== values.password) return 'Les mots de passe ne correspondent pas';
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

  // useEffect for handling form errors and notifications related to password confirmation
  useEffect(() => {
    // Display a notification if the password and the password confirmation do not match
    if (form.values.password && form.values.confirmPassword && !form.errors.confirmPassword) {
      setFormError(null);
    }
    // Display a notification if an error is present in the form
    if (formError) {
      showNotification({ title: 'Erreur', message: formError, color: 'red' });
      setFormError(null);
    }
    // Display a notification if a constraint error is present in the API response (e.g. email already exists or username already exists)
    if (loginError) {
      showNotification({
        title: 'Erreur de connexion',
        message: loginError,
        color: 'red',
      });
      setLoginError(null);
    }
  }, [formError, loginError, form.errors, form.values]);

  // Function to handle field blur event and validate field
  const handleBlur = (fieldName: string) => {
    form.validateField(fieldName);
  };

  // Object to store fields by step
  type FieldsByStepType = {
    [key: number]: string[];
  };

  // Logic for handling steps in the form
  const fieldsByStep: FieldsByStepType = {
    0: ['username', 'firstname', 'lastname', 'email', 'password', 'confirmPassword'],
    // Ajoute d'autres étapes si nécessaire
  };

  // Function to go to the next page of the form
  const goToNextStep = () => {
    if (activeStep === 0) {
      const currentStepFields = fieldsByStep[activeStep];

      const areAllFieldsFilled = currentStepFields.every((field) => {
        const value = form.values[field as keyof FormValues];
        return value !== null && value !== '';
      });

      if (!areAllFieldsFilled) {
        setErrorMessage('Veuillez remplir tous les champs.');
        return;
      }

      const errors = form.validate();
      const hasErrors = currentStepFields.some((field) => !!errors[field as keyof typeof errors]);

      if (!hasErrors) {
        setErrorMessage(null); // Réinitialiser le message d'erreur
        setActiveStep(activeStep + 1);
      } else {
        setErrorMessage('Il y a des erreurs dans vos saisies.');
      }
    }
  };

  // Function to go back to the previous page of the form
  const goToPreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!form.values.terms) {
      setTermsError('* Vous devez accepter les termes et conditions');
      return;
    }
    setTermsError(null);

    console.log('form birthday', form.values.birthday);

    const formData = new FormData();

    // Ajoute toutes les données du formulaire à formData, sauf 'terms'
    Object.entries(form.values).forEach(([key, value]) => {
      if (key !== 'terms') {
        if (key === 'birthday' && value) {
          // Formate et ajoute la date de naissance si le champ n'est pas vide
          const formattedDate = dayjs(value).format('YYYY-MM-DD');
          formData.append(key, formattedDate);
        } else if (value) {
          // Ajoute les champs obligatoires
          formData.append(key, value);
        }
      }
    });
    // Ajoute l'image si présente
    if (imageFile) {
      formData.append('image_url', imageFile);
    }
    // Vérifie le contenu de formData
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/signup`,
        formData, // Données envoyées à l'API
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) {
        handleSuccess(response);
        setModalOpen(true);
      } else {
        throw new Error(`La requête a échoué avec le statut : ${response.status}`);
      }
    } catch (error: any) {
      if (
        error.response.status === 400 &&
        error.response.data.message.includes('Email or username already exist')
      ) {
        setApiErrorMessage(
          "L'email ou le nom d'utilisateur existe déjà. Veuillez en choisir un autre."
        );
      } else {
        handleError(error);
      }
    }
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

      setImageFile(file); // Stocke le fichier d'image pour l'envoi
      const imageUrl = URL.createObjectURL(file); // Crée une URL pour afficher l'aperçu
      setImagePreview(imageUrl); // Met à jour l'état pour l'aperçu
    }
  };

  // Function to handle image removal
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Révoquer l'URL pour libérer les ressources
      setImagePreview(null); // Réinitialiser l'aperçu d'image
    }
  };

  // Function to handle back button click
  const handleBackClick = () => {
    // Rediriger vers '/' pour un utilisateur non connecté (role à null)
    // et vers '/main' pour les autres rôles
    if (user.role === 'visitor') {
      navigate('/');
    } else {
      navigate('/main');
    }
  };

  return (
    <Container className={`container ${classes.mediaContainer}`}>
      <AlertModal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Inscription réussie !"
        buttonText="Se connecter"
        redirectTo="/login"
      >
        <Text>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.</Text>
      </AlertModal>
      <Flex direction="column" justify="center" align="center" gap={10}>
        <Title order={isMobile ? 3 : 1} className={`${classes.title}`} mt={50}>
          Bienvenue sur Family Flow
        </Title>
        <Title order={isMobile ? 5 : 3} mb={20} className={`${classes.title}`}>
          Veuillez entrer vos informations
        </Title>
      </Flex>
      {activeStep === 0 && (
        <div className="slide1">
          <TextInput
            placeholder="Ton pseudo"
            label="Pseudo"
            className="input"
            {...form.getInputProps('username')}
            onBlur={() => handleBlur('username')}
            radius="xl"
            required
            mt={20}
          />
          <TextInput
            placeholder="Ton nom"
            label="Nom"
            className="input"
            {...form.getInputProps('firstname')}
            onBlur={() => handleBlur('firstname')}
            radius="xl"
            required
          />
          <TextInput
            placeholder="Ton prénom"
            label="Prénom"
            className="input"
            {...form.getInputProps('lastname')}
            onBlur={() => handleBlur('lastname')}
            radius="xl"
            required
          />
          <TextInput
            placeholder="Ton email"
            label="email"
            className="input"
            {...form.getInputProps('email')}
            onBlur={() => handleBlur('email')}
            radius="xl"
            required
          />
          <PasswordInput
            placeholder="Ton mot de passe"
            label="Mot de passe"
            className="input"
            {...form.getInputProps('password')}
            onBlur={() => handleBlur('password')}
            radius="xl"
            required
          />
          <PasswordInput
            placeholder="Confirmer ton mot de passe"
            label="Confirmer du mot de passe"
            className="input"
            {...form.getInputProps('confirmPassword')}
            onBlur={() => handleBlur('confirmPassword')}
            radius="xl"
            mb={20}
            required
          />
          <Flex justify="center">{errorMessage && <Text color="red">{errorMessage}</Text>}</Flex>
          <Flex justify="center">
            <Button
              className="outlineButton"
              onClick={handleBackClick}
              w={100}
              m={10}
              size="responsive"
              radius="xl"
            >
              Retour
            </Button>
            <Button
              onClick={goToNextStep}
              className="gradientButton"
              m={10}
              w={100}
              size="responsive"
              radius="xl"
            >
              Suivant
            </Button>
          </Flex>
        </div>
      )}
      {activeStep === 1 && (
        <div className="slide2">
          <DatePickerInput
            monthsListFormat="MM"
            yearsListFormat="YY"
            label="Date de naissance"
            className="input"
            {...form.getInputProps('birthday')}
            mt={20}
            mb={20}
            size="xs"
          />
          <Textarea
            placeholder="Parle un de toi en quelques mots..."
            label="Description"
            className="input"
            {...form.getInputProps('description')}
            onBlur={() => {
              handleBlur('description');
              setDescriptionTouched(true);
            }}
            mb={20}
          />
          <Dropzone
            className="input dropbox"
            onDrop={handleFileUpload}
            onReject={() => setFormError('Fichier rejeté')}
            maxSize={3 * 1024 ** 2}
            disabled={!!imagePreview}
            accept={IMAGE_MIME_TYPE}
            {...props}
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
                    Seul les fichiers PNG et JPEG sont autorisés
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
                    maxWidth: '250px',
                    maxHeight: '0px',
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
          <Flex justify="center">
            <Checkbox
              label="J'accepte les termes et conditions"
              {...form.getInputProps('terms', { type: 'checkbox' })}
              onChange={(event) => {
                form.setFieldValue('terms', event.currentTarget.checked);
                setTermsError(null);
              }}
              m={10}
            />
          </Flex>
          {termsError && (
            <Flex justify="center">
              <Text style={{ color: 'red' }} m={10}>
                {termsError}
              </Text>
            </Flex>
          )}
          {apiErrorMessage && (
            <Flex justify="center">
              <Text style={{ color: 'red' }} m={10}>
                {apiErrorMessage}
              </Text>
            </Flex>
          )}
          <Flex justify="center">
            <Button
              onClick={goToPreviousStep}
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
        </div>
      )}
      {formError && <Alert color="red">{formError}</Alert>}
      {loginError && <Alert color="red">{loginError}</Alert>}
    </Container>
  );
}

export default Signup;
