// src/pages/onboarding/ProfessionalOnboardingPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { OnboardingLayout } from './OnboardingLayout';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SecondStep } from './steps/SecondStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { OnboardingStep } from './OnboardingLayout';

export function ProfessionalOnboardingPage() {
  const { updateUser, saveOpeningHours } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps: OnboardingStep[] = [
    {
      id: 'personal-info',
      title: t.onboarding.personalInfo,
      component: (props) => <PersonalInfoStep {...props} />,
    },
    {
      id: 'availability',
      title: t.onboarding.availability,
      component: (props) => <SecondStep {...props} />,
    },
    // Add more steps as needed
  ];

  const handleComplete = async (data: any) => {
    console.log(data);

    try {
      await updateUser({
        ...data.personal,
        onboardingCompleted: true,
      });
      await saveOpeningHours(data.openingHours);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return <OnboardingLayout steps={steps} onComplete={handleComplete} />;
}
