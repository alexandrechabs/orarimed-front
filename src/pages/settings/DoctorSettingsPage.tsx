import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultationReasons from '@/components/admin/ConsultationReasons';
import OpeningHoursForm from '@/components/admin/OpeningHoursForm';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuth } from '@/services/auth/useAuth';
import { OpeningHour } from '@/types/openingHour';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/services/user/useUser';
import { ConsultationReason } from '@/types/consultationReason';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DoctorSettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getOpeningHours, saveOpeningHours, getReasons, saveReasons } =
    useUser();
  const methods = useForm({
    defaultValues: {
      openingHours: [],
    },
  });
  const consultationReasonsMethods = useForm({
    defaultValues: {
      consultationReasons: [],
    },
  });
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'opening-hours';
  const { handleSubmit, setValue, watch, reset } = methods;
  const {
    handleSubmit: consultationReasonsHandleSubmit,
    watch: consultationReasonsWatch,
    reset: consultationReasonsReset,
  } = consultationReasonsMethods;
  const { toast } = useToast();

  useEffect(() => {
    getOpeningHours(user.id).then((openingHours) => {
      if (openingHours) {
        reset({
          openingHours: openingHours,
        });
      }
    });
    getReasons(user.id).then((reasons) => {
      if (reasons) {
        const reasonsWithEditing = reasons.map((reason) => ({
          ...reason,
          isEditing: false, // S'assure que isEditing est défini
          tempId: reason.id?.toString(), // Crée un tempId basé sur l'ID si nécessaire
        }));
        consultationReasonsReset({
          consultationReasons: reasons,
        });
      }
    });
  }, []);

  const onSubmit = (formData: { openingHours: OpeningHour[] }) => {
    let openingHours = formData.openingHours;
    openingHours.forEach((openingHour) => {
      openingHour.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    saveOpeningHours(user.id, openingHours);
    toast({
      title: t.common.success,
      description: t.doctorParams.saveOpeningHour,
    });
  };

  const onConsultationReasonsSubmit = (formData: {
    consultationReasons: ConsultationReason[];
  }) => {
    let consultationReasons = formData.consultationReasons;
    saveReasons(user.id, consultationReasons);
    toast({
      title: t.common.success,
      description: t.doctorParams.saveReason,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.doctorParams.title}
        </h1>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="opening-hours">
            {t.doctorParams.openingHours}
          </TabsTrigger>
          <TabsTrigger value="consultation-reasons">
            {t.doctorParams.consultationReasons}
          </TabsTrigger>
        </TabsList>

        {user.roleId === 2 && (
          <TabsContent value="opening-hours">
            <Card>
              <CardHeader>
                <CardTitle>{t.doctorParams.openingHours}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormProvider {...methods}>
                  <form
                    id="onboarding-form-1"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {t.doctorParams.openingHoursDescription}
                      </p>

                      <div className="mt-6">
                        <OpeningHoursForm />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button type="submit">{t.common.save}</Button>
                    </div>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {user.roleId === 2 && (
          <TabsContent value="consultation-reasons">
            <Card>
              <CardHeader>
                <CardTitle>{t.doctorParams.consultationReasons}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  {t.doctorParams.consultationReasonsDescription}
                </p>

                <FormProvider {...consultationReasonsMethods}>
                  <form
                    id="onboarding-form-2"
                    onSubmit={consultationReasonsHandleSubmit(
                      onConsultationReasonsSubmit,
                    )}
                    className="space-y-6"
                  >
                    <ConsultationReasons />
                    <div className="flex justify-center">
                      <Button type="submit">{t.common.save}</Button>
                    </div>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
