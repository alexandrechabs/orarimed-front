// src/pages/onboarding/OnboardingLayout.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useForm, FormProvider } from 'react-hook-form';

export interface OnboardingStep {
  id: string;
  title: string;
  component: React.ComponentType<OnboardingStepProps>;
}

interface OnboardingStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
}

interface OnboardingLayoutProps {
  steps: OnboardingStep[];
  onComplete: (data: any) => Promise<void>;
}

export function OnboardingLayout({ steps, onComplete }: OnboardingLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: formData,
  });

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = (stepData: any) => {
    const newData = { ...formData, ...stepData };
    setFormData(newData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete(newData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleComplete = async (data: any) => {
    try {
      setIsSubmitting(true);
      await onComplete(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Progress bar */}
        <div className="w-full bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Progress value={progress} className="h-2" />
            <div className="mt-2 text-sm text-gray-600">
              {currentStep + 1} of {steps.length} · {currentStepData.title}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto py-8 px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <StepComponent
              onNext={handleNext}
              onBack={handleBack}
              data={formData}
            />
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                {/* {t.common.back} */}
                Retour
              </Button>

              <Button
                type="submit"
                form={`onboarding-form-${currentStep}`}
                disabled={isSubmitting}
              >
                {/* {currentStep === steps.length - 1
                  ? isSubmitting
                    ? t.common.finishing
                    : t.common.finish
                  : t.common.next} */}
                {currentStep === steps.length - 1
                  ? isSubmitting
                    ? 'Finishing'
                    : 'Finish'
                  : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
