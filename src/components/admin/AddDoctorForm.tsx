import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/services/user/useUser";
import { UserRole } from "@/types/roles";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PhoneInput from "react-phone-number-input";
import { useAuth } from "@/services/auth/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AddressAutocomplete from "../Autocomplete";
import type { CountryCode } from "libphonenumber-js";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ImageUpload from "../ui/ImageUpload";
import { a } from "node_modules/framer-motion/dist/types.d-DagZKalS";

const allowedCountries: CountryCode[] = ["AL", "FR", "GB"];

// Fonction pour créer le schéma en fonction du mode (édition ou création)
const createDoctorSchema = (isEditMode: boolean) => {
  const baseSchema = {
    email: z.string().email("Email invalide"),
    firstname: z.string().min(2, "Le prénom est requis"),
    lastname: z.string().min(2, "Le nom est requis"),
    address: z.string().min(5, "L'adresse est requise"),
    city: z.string().min(2, "La ville est requise"),
    country: z.string().min(2, "Le pays est requis"),
    coordinate: z.object({
      x: z.number(),
      y: z.number(),
    }),
    phoneNumber: z.string().min(10, "Numéro de téléphone invalide"),
    visible: z.boolean().default(false).optional(),
    specialityId: z.number().min(1, "La spécialité est requise"),
    subSpecialityId: z.array(z.number()).optional(), // Nouveau champ
    language: z.string().min(2, "La langue est requise"),
    acceptTerms: isEditMode
      ? z.boolean()
      : z.boolean().refine((val) => val === true, {
          message: "Vous devez accepter les conditions d'utilisation",
        }),
  };

  return z.object({
    ...baseSchema,
  });
};

type DoctorFormValues = z.infer<ReturnType<typeof createDoctorSchema>>;

interface DoctorFormProps {
  onSuccess: () => void;
  onClose: () => void;
  user?: {
    id?: string;
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    avatar?: string;
    city: string;
    country: string;
    coordinate: {
      x: number;
      y: number;
    };
    phoneNumber: string;
    specialityId: number;
    subSpecialityId?: number[];
    visible: boolean;
    active: boolean;
    language: string;
  } | null;
}

export function AddDoctorForm({
  onSuccess,
  onClose,
  user = null,
}: DoctorFormProps) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();
  const { specialities } = useAuth();
  const { language } = useLanguage();
  const { createUser, updateUser, saveSubSpecialities, savePhotoUser } =
    useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(
    user?.avatar || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!user;
  const doctorSchema = createDoctorSchema(isEditMode);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: user
      ? {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          address: user.address,
          city: user.city,
          country: user.country,
          coordinate: {
            x: user.coordinate.x,
            y: user.coordinate.y,
          },
          phoneNumber: user.phoneNumber,
          visible: user.visible,
          specialityId: user.specialityId,
          subSpecialityId: user.subSpecialityId,
          language: user.language,
        }
      : {
          email: "",
          firstname: "",
          lastname: "",
          address: "",
          city: "",
          country: "",
          coordinate: { x: 0, y: 0 },
          phoneNumber: "",
          visible: false,
          specialityId: 0,
          acceptTerms: false,
          subSpecialityId: [],
        },
  });

  const onSubmit = async (data: DoctorFormValues) => {
    try {
      setIsLoading(true);
      // Créer l'objet de base avec les champs communs
      const baseUserData = {
        ...(isEditMode && user?.id && { id: user.id }), // Inclure l'ID seulement en mode édition
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        address: data.address,
        city: data.city,
        country: data.country,
        coordinate: {
          x: data.coordinate.x,
          y: data.coordinate.y,
        },
        phoneNumber: data.phoneNumber,
        roleId: UserRole.DOCTOR,
        visible: data.visible, // Conserver l'état actuel en mode édition
        active: user?.active,
        specialityId: data.specialityId,
        language: data.language,
      };

      // Créer l'objet final en fonction du mode
      const userData = isEditMode
        ? {
            ...baseUserData,
            acceptTerms: true, // Valeur par défaut en mode édition
          }
        : {
            ...baseUserData,
            acceptTerms: Boolean(data.acceptTerms),
          };

      let result;
      if (isEditMode && user?.id) {
        // Mise à jour de l'utilisateur existant
        result = await updateUser(user.id, userData);
        toast({
          title: "Succès",
          description:
            "Les informations du médecin ont été mises à jour avec succès",
        });
      } else {
        // Création d'un nouvel utilisateur
        result = await createUser(userData);
        toast({
          title: "Succès",
          description: "Le compte docteur a été créé avec succès",
        });
      }

      // save sub specialities
      if (data.subSpecialityId && data.subSpecialityId.length > 0) {
        await saveSubSpecialities(user?.id, data.subSpecialityId);
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
    if (!user) return;

    try {
      setIsUploading(true);

      // Convertir l'image recadrée en fichier
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      // Créer FormData pour l'envoi
      const formData = new FormData();
      formData.append("file", file);

      let image = await savePhotoUser(formData, user.id);
      user.avatar = image.image;
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
                    user?.avatar
                      ? `${API_URL}/user/${user.id}/avatar/${user.avatar}`
                      : "default-avatar.png"
                  }
                  alt={`${user?.firstname} ${user?.lastname}`}
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
                <span className="sr-only">Changer la photo de profil</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Cliquez sur l'icône pour changer votre photo de profil
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prénom</Label>
            <Input {...register("firstname")} />
            {errors.firstname && (
              <p className="text-sm text-destructive">
                {errors.firstname.message}
              </p>
            )}
          </div>
          <div>
            <Label>Nom</Label>
            <Input {...register("lastname")} />
            {errors.lastname && (
              <p className="text-sm text-destructive">
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} autoComplete="new-email" />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label>Adresse</Label>
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
            placeholder="Saisissez l'adresse de votre cabinet"
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div>
          <Label>Téléphone</Label>
          <PhoneInput
            international
            defaultCountry="AL"
            countries={allowedCountries}
            value={watch("phoneNumber")}
            onChange={(value) => setValue("phoneNumber", value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background"
            placeholder="+33 6 12 34 56 78"
            autoComplete="new-phone"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div>
          <Label>Spécialité</Label>
          <Select
            value={watch("specialityId")?.toString() || ""}
            onValueChange={(value) => {
              // Convertir la valeur en nombre car specialityId est un nombre
              const specialityId = parseInt(value, 10);
              setValue("specialityId", specialityId, { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une spécialité" />
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
        <div className="space-y-2">
          <Label>Sous-spécialités (optionnel)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {specialities
              .find((s) => s.id === Number(watch("specialityId")))
              ?.subSpecialities.map((sub) => (
                <div key={sub.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`sub-${sub.id}`}
                    value={sub.id}
                    checked={
                      watch("subSpecialityId")?.includes(sub.id) || false
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue("subSpecialityId", [
                          ...(watch("subSpecialityId") || []),
                          sub.id,
                        ]);
                      } else {
                        setValue(
                          "subSpecialityId",
                          (watch("subSpecialityId") || []).filter(
                            (id) => id !== sub.id,
                          ),
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`sub-${sub.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {sub.translations?.find((t) => t.locale === language)
                      ?.name || sub.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Langue</Label>
          <Select
            value={watch("language")?.toString() || ""}
            onValueChange={(value) => {
              // Convertir la valeur en nombre car specialityId est un nombre
              setValue("language", value, { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="sq" value="sq"></SelectItem>
              <SelectItem key="en" value="en">
                English
              </SelectItem>
              <SelectItem key="fr" value="fr">
                Français
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.language && (
            <p className="text-sm text-destructive">
              {errors.language.message}
            </p>
          )}
        </div>
        {!isEditMode && (
          <>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                {...register("acceptTerms")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="acceptTerms" className="text-sm font-medium">
                J'accepte les conditions d'utilisation
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}
          </>
        )}

        {/* Interrupteur Actif/Inactif */}
        <div className="flex items-center space-x-2 mt-4">
          <Label htmlFor="visible" className="text-sm font-medium">
            Compte visible
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
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Mettre à jour" : "Créer le compte"}
          </Button>
        </div>
      </form>
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Recadrer l'image</DialogTitle>
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
              Annuler
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
                  Enregistrement...
                </div>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
