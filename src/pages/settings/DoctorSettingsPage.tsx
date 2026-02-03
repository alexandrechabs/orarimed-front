import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultationReasons from '@/components/admin/ConsultationReasons';
import OpeningHoursForm from '@/components/admin/OpeningHoursForm';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useAuth } from '@/services/auth/useAuth';
import { OpeningHour } from '@/types/openingHour';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

export default function DoctorSettingsPage() {
  const { user, getOpeningHours, saveOpeningHours } = useAuth();
  const methods = useForm({
    defaultValues: {
      openingHours: [],
    },
  });
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'opening-hours';

  const { handleSubmit, setValue, watch, reset } = methods;

  useEffect(() => {
    getOpeningHours().then((openingHours) => {
      if (openingHours) {
        reset({
          openingHours: openingHours,
        });
      }
    });
  }, []);

  const onSubmit = (formData: { openingHours: OpeningHour[] }) => {
    let openingHours = formData.openingHours;
    openingHours.forEach((openingHour) => {
      openingHour.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    saveOpeningHours(openingHours);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Paramètres du cabinet
        </h1>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="opening-hours">Horaires d'ouverture</TabsTrigger>
          <TabsTrigger value="consultation-reasons">
            Motifs de consultation
          </TabsTrigger>
        </TabsList>

        {user.roleId === 2 && (
          <TabsContent value="opening-hours">
            <FormProvider {...methods}>
              <form
                id="onboarding-form-1"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Horaires d'ouverture</h2>
                  <p className="text-sm text-gray-600">
                    Définissez vos horaires de consultation. Vous pourrez les
                    modifier ultérieurement.
                  </p>

                  <div className="mt-6">
                    <OpeningHoursForm />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </FormProvider>
          </TabsContent>
        )}
        {user.roleId === 2 && (
          <TabsContent value="consultation-reasons">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Motif de consultation</h2>
              <p className="text-sm text-gray-600">
                Définissez vos motifs de consultation. Vous pourrez les modifier
                ultérieurement.
              </p>

              <div className="mt-6">
                <ConsultationReasons />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
