import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface DoctorPhotoStepProps {
  onNext?: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

export const DoctorPhotoStep = ({
  onNext,
  onBack,
  data,
}: DoctorPhotoStepProps) => {
  const { t } = useLanguage();
  const { setValue, watch, handleSubmit } = useFormContext();

  const photoUrl = watch("photoUrl");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const onSubmit = () => {
    // Si on a un fichier, on le convertit en URL blob
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      // Mettre à jour la valeur dans le formulaire
      setValue("photoUrl", url, { shouldValidate: true });
      onNext({ photoUrl: url, photoFile });
    } else if (photoUrl) {
      // Si on a déjà une URL mais pas de fichier (cas où l'utilisateur ne change pas la photo)
      onNext({ photoUrl });
    } else {
      // Cas où il n'y a pas de photo
      onNext({ photoUrl: "" });
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onBack();
  };

  return (
    <form id="onboarding-form-1" onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t.picture.addProfile}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">
              {t.picture.professional}
            </p>

            <div className="flex justify-center">
              <div className="w-64">
                <ImageUpload
                  value={photoUrl || ""}
                  onChange={(value) => {
                    if (value instanceof File) {
                      setPhotoFile(value);
                      const url = URL.createObjectURL(value);
                      setValue("photoUrl", url, { shouldValidate: true });
                    } else if (value === null) {
                      setPhotoFile(null);
                      setValue("photoUrl", "", { shouldValidate: true });
                    } else {
                      setValue("photoUrl", value, { shouldValidate: true });
                    }
                  }}
                  label={t.picture.download}
                  aspect={1}
                  maxWidth={2000}
                  maxHeight={2000}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
