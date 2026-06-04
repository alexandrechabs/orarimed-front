import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/services/user/useUser";
import { Camera, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-number-input";
import { useAuth } from "@/services/auth/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AddressAutocomplete from "../Autocomplete";
import type { CountryCode } from "libphonenumber-js";
import { Checkbox } from "../ui/checkbox";
import { Center } from "@/types/center";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "../ui/ImageUpload";

const allowedCountries: CountryCode[] = ["AL", "FR", "GB"];

// Fonction pour créer le schéma en fonction du mode (édition ou création)
const createDoctorSchema = (isEditMode: boolean, errors: any) => {
  return z.object({
    email: z.string().email(errors.email),
    name: z.string().min(2, errors.name),
    address: z.string().min(5, errors.address),
    city: z.string().min(2, errors.city),
    country: z.string().min(2, errors.country),
    coordinate: z.object({
      x: z.number(),
      y: z.number(),
    }),
    phoneNumber: z.string().min(10, errors.phone),
    visible: z.boolean().default(false).optional(),
    specialityId: z.number().min(1, errors.speciality),
    description: z.string().optional(),
  });
};

type CenterFormValues = z.infer<ReturnType<typeof createDoctorSchema>>;

interface CenterFormProps {
  onSuccess: () => void;
  onClose: () => void;
  center?: Center;
}

export function AddCenterForm({
  onSuccess,
  onClose,
  center = null,
}: CenterFormProps) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();
  const { specialities } = useAuth();
  const { t, language } = useLanguage();
  const { createCenter, updateCenter, savePhotoCenter, getCenter } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(
    center?.avatar || null,
  );

  const isEditMode = !!center;
  const doctorSchema = createDoctorSchema(
    isEditMode,
    t.adminSettings.office.officeForm.error,
  );

  const office = t.adminSettings.office;

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CenterFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: center
      ? {
          email: center.email,
          name: center.name,
          address: center.address,
          city: center.city,
          country: center.country,
          coordinate: {
            x: center.coordinate.x,
            y: center.coordinate.y,
          },
          phoneNumber: center.phoneNumber,
          visible: center.visible,
          specialityId: center.specialityId,
          description: center.description,
        }
      : {
          email: "",
          name: "",
          address: "",
          city: "",
          country: "",
          coordinate: { x: 0, y: 0 },
          phoneNumber: "",
          visible: false,
          specialityId: 0,
        },
  });

  const onSubmit = async (data: CenterFormValues) => {
    try {
      setIsLoading(true);
      // Créer l'objet de base avec les champs communs
      const userData = {
        ...(isEditMode && center?.id && { id: center.id }), // Inclure l'ID seulement en mode édition
        email: data.email,
        name: data.name,
        address: data.address,
        description: data.description,
        city: data.city,
        country: data.country,
        coordinate: {
          x: data.coordinate.x,
          y: data.coordinate.y,
        },
        phoneNumber: data.phoneNumber,
        visible: data.visible, // Conserver l'état actuel en mode édition
        active: center?.active,
        specialityId: data.specialityId,
      };

      let result;
      if (isEditMode && center?.id) {
        // Mise à jour du cabinet existant
        result = await updateCenter(center.id, userData);
        toast({
          title: "Succès",
          description:
            "Les informations du cabinet ont été mises à jour avec succès",
        });
      } else {
        // Création d'un nouveau cabinet
        result = await createCenter(userData);
        toast({
          title: "Succès",
          description: "Le cabinet a été créé avec succès",
        });
      }

      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: string) => {
    if (!center) return;

    try {
      setIsUploading(true);

      // Convertir l'image recadrée en fichier
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      // Créer FormData pour l'envoi
      const formData = new FormData();
      formData.append("file", file);

      let image = await savePhotoCenter(formData, center.id);

      center.avatar = image.image;

      setIsCropModalOpen(false);
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image:", error);
      alert("Une erreur est survenue lors du téléversement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("Erreurs lors de la soumission:", errors);
        })}
        className="space-y-4"
      >
        {isEditMode && (
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative group">
              <Avatar className="h-40 w-40">
                <AvatarImage
                  src={
                    center?.avatar
                      ? `${API_URL}/center/${center.id}/avatar/${center.avatar}`
                      : "hopital.png"
                  }
                  alt={`${center?.name}`}
                />
              </Avatar>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(true)}
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
                <span className="sr-only">{t.params.changePicture}</span>
              </button>
            </div>
          </div>
        )}
        <div>
          <Label>{office.officeForm.name}</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>{office.officeForm.email}</Label>
          <Input type="email" {...register("email")} autoComplete="new-email" />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label>{office.officeForm.description}</Label>
          <textarea
            {...register("description")}
            placeholder={office.officeForm.descriptionPlaceholder}
            className="w-full h-32 p-2 border rounded-md text-sm"
            required
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <Label>{office.officeForm.address}</Label>
          <AddressAutocomplete
            type="address"
            value={watch("address")} // Use watch to get the current value
            onChange={(value) => setValue("address", value)} // Use setValue to update the value
            onPlaceSelected={(place) => {
              setValue("address", place.formatted_address);
              setValue(
                "city",
                place.address_components.find((component) =>
                  component.types.includes("locality"),
                )?.long_name || "",
              );
              setValue(
                "country",
                place.address_components.find((component) =>
                  component.types.includes("country"),
                ).long_name,
              );
              setValue("coordinate", {
                x: place.geometry.location.lat(),
                y: place.geometry.location.lng(),
              });
            }}
            className="bg-background"
            placeholder={office.officeForm.addressPlaceholder}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div>
          <Label>{office.officeForm.phone}</Label>
          <PhoneInput
            international
            defaultCountry="AL"
            countries={allowedCountries}
            value={watch("phoneNumber")}
            onChange={(value) => setValue("phoneNumber", value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background"
            placeholder={office.officeForm.phonePlaceholder}
            autoComplete="new-phone"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div>
          <Label>{office.officeForm.speciality}</Label>
          <Select
            value={watch("specialityId")?.toString() || ""}
            onValueChange={(value) => {
              // Convertir la valeur en nombre car specialityId est un nombre
              const specialityId = parseInt(value, 10);
              setValue("specialityId", specialityId, { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={office.officeForm.specialityPlaceholder}
              />
            </SelectTrigger>
            <SelectContent>
              {specialities?.map((speciality) => (
                <SelectItem
                  key={speciality.id}
                  value={speciality.id.toString()}
                >
                  {
                    speciality.translations.find((t) => t.locale === language)
                      ?.name
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.specialityId && (
            <p className="text-sm text-destructive">
              {errors.specialityId.message}
            </p>
          )}
        </div>

        {/* Interrupteur Actif/Inactif */}
        <div className="flex items-center space-x-2 mt-4">
          <Label htmlFor="visible" className="text-sm font-medium">
            {office.officeForm.visible}
          </Label>
          <Checkbox
            id="visible"
            checked={watch("visible")}
            onCheckedChange={(checked) => setValue("visible", Boolean(checked))}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onClose?.();
            }}
            disabled={isLoading}
          >
            {t.common.cancel}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? t.common.update : t.common.create}
          </Button>
        </div>
      </form>
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t.stats.resizePicture}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="w-full max-w-md mx-auto">
              <ImageUpload
                value={tempImage || ""}
                onChange={(value) => {
                  if (value === null) {
                    setTempImage(null);
                  } else if (typeof value === "string") {
                    setTempImage(value);
                  } else if (value instanceof File) {
                    handleImageSelect(value);
                  }
                }}
                aspect={1}
                maxWidth={2000}
                maxHeight={2000}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCropModalOpen(false)}
              disabled={isUploading}
            >
              {t.common.cancel}
            </Button>
            <Button
              onClick={() => {
                if (tempImage) {
                  handleCropComplete(tempImage);
                }
              }}
              disabled={!tempImage || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.common.saving}
                </div>
              ) : (
                t.common.save
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
