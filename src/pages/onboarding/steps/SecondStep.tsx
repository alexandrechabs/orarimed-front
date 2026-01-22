import { useForm, FormProvider } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OpeningHour } from '@/types/openingHour';
import OpeningHoursForm from '@/components/opening-hours/OpeningHoursForm';
import { useAuth } from '@/services/auth/useAuth';

interface SecondStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: {
    openingHours?: OpeningHour[];
    [key: string]: any;
  };
}

export function SecondStep({ onNext, onBack, data }: SecondStepProps) {
  const { user } = useAuth();

  const methods = useForm({
    defaultValues: {
      openingHours: data.openingHours || [],
    },
  });

  const { handleSubmit, setValue, watch } = methods;
  const openingHours = watch('openingHours');

  useEffect(() => {
    // S'assurer que chaque horaire a un ID utilisateur
    if (user?.id && openingHours) {
      const updatedHours = openingHours.map((hour: OpeningHour) => ({
        ...hour,
        userId: user.id,
      }));
      setValue('openingHours', updatedHours);
    }
  }, [user?.id, openingHours, setValue]);

  const onSubmit = (formData: { openingHours: OpeningHour[] }) => {
    console.log('Horaires soumis:', formData);
    onNext({ openingHours: formData.openingHours });
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onBack();
  };

  return (
    <FormProvider {...methods}>
      <form
        id="onboarding-form-1"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Horaires d'ouverture</h2>
          <p className="text-sm text-gray-600">
            Définissez vos horaires de consultation. Vous pourrez les modifier
            ultérieurement.
          </p>

          <div className="mt-6">
            <OpeningHoursForm name="openingHours" />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
