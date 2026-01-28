// src/pages/onboarding/ProfessionalOnboardingPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { OnboardingLayout } from './OnboardingLayout';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { OpeningHourStep } from './steps/OpeningHourStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { OnboardingStep } from './OnboardingLayout';
import { useEffect } from 'react';

export function ProfessionalOnboardingPage() {
  const { updateUser, saveOpeningHours, saveSubSpecialities } = useAuth();
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
      id: 'availability',
      title: t.onboarding.availability,
      component: (props) => <OpeningHourStep {...props} />,
    },
    // Add more steps as needed
  ];

  const handleComplete = async (data: any) => {
    console.log(data);

    let subSpecialities = data.personal.subSpecialityIds;
    delete data.personal.subSpecialityIds;

    console.log(subSpecialities);
    console.log(data.personal);

    try {
      await updateUser(data.personal);
      await saveSubSpecialities(subSpecialities);
      await saveOpeningHours(data.openingHours);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return <OnboardingLayout steps={steps} onComplete={handleComplete} />;
}
