// src/pages/onboarding/ProfessionalOnboardingPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { OnboardingLayout } from './OnboardingLayout';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { OpeningHourStep } from './steps/OpeningHourStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { OnboardingStep } from './OnboardingLayout';
import { useEffect } from 'react';
import { DoctorPhotoStep } from '@/components/onboarding/steps/DoctorPhotoStep';

export function ProfessionalOnboardingPage() {
  const { updateUser, saveOpeningHours, saveSubSpecialities, savePhotoUser } =
    useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {}, []);

  const steps: OnboardingStep[] = [
    {
      id: 'personal-info',
      title: t.onboarding.personalInfo,
      component: (props) => <PersonalInfoStep {...props} />,
    },
    {
      id: 'photo',
      title: t.onboarding.photo || 'Photo de profil',
      component: (props) => <DoctorPhotoStep {...props} />,
    },
    {
      id: 'availability',
      title: t.onboarding.availability,
      component: (props) => <OpeningHourStep {...props} />,
    },
    // Add more steps as needed
  ];

  const handleComplete = async (data: any) => {
    let subSpecialities = data.personal.subSpecialityIds;
    delete data.personal.subSpecialityIds;

    console.log(data);

    try {
      let photoUrl = data.photoUrl;

      if (
        data.photoUrl &&
        typeof data.photoUrl === 'string' &&
        data.photoUrl.startsWith('blob:')
      ) {
        try {
          // 1. Récupérer le fichier à partir de l'URL blob
          const response = await fetch(data.photoUrl);
          const blob = await response.blob();

          // 2. Créer un objet File à partir du blob
          const file = new File([blob], 'profile-photo.jpg', {
            type: blob.type,
          });

          // 3. Créer FormData et ajouter le fichier
          const formData = new FormData();
          formData.append('file', file);

          // 4. Envoyer au serveur
          let result = await savePhotoUser(formData);
          photoUrl = result.image;
        } catch (error) {
          console.error("Erreur lors du traitement de l'image :", error);
          throw new Error('Impossible de traiter la photo de profil');
        }
      }

      // 2. Mettre à jour les données du médecin avec l'URL de la photo
      const userData = {
        ...data.personal,
        avatar: photoUrl, // Utiliser l'URL de la photo uploadée
      };

      await saveSubSpecialities(subSpecialities);
      await updateUser(userData);
      await saveOpeningHours(data.openingHours);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return <OnboardingLayout steps={steps} onComplete={handleComplete} />;
}
