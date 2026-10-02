import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import SpecialitiesManager from "@/components/admin/SpecialtiesManager";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/services/auth/useAuth";
import { Speciality } from "@/types/specialty";

export default function AdminSpecialitiesSettingsPage() {
  const { t } = useLanguage();
  const { getSpecialities, saveSpecialities, specialities } = useAuth();
  const adminT = t.adminSettings;

  useEffect(() => {
    getSpecialities();
  }, []);

  const handleSaveSpecialities = (items: Speciality[]) => {
    const hasEmptyNames = items.some(
      (speciality) =>
        !speciality.translations.some((translation) =>
          translation.name.trim(),
        ) ||
        speciality.subSpecialities.some(
          (subSpeciality) =>
            !subSpeciality.translations.some((translation) =>
              translation.name.trim(),
            ),
        ),
    );

    if (hasEmptyNames) {
      toast({
        title: t.common.error,
        description: adminT.speciality.specialityError,
        variant: "destructive",
      });
      return;
    }

    saveSpecialities(items);
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="p-[14px]">
          <CardTitle>{adminT.manageSpecialities}</CardTitle>
          <p className="mb-2 text-sm text-muted-foreground">
            {adminT.manageSpecialitiesDescription}
          </p>
        </CardHeader>
        <CardContent className="p-[14px]">
          <SpecialitiesManager
            onSave={handleSaveSpecialities}
            initialData={specialities}
          />
        </CardContent>
      </Card>
    </div>
  );
}
