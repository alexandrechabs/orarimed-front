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
import { useEffect, useState } from "react";
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
import type { CountryCode } from "libphonenumber-js";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ImageUpload from "../ui/ImageUpload";

const allowedCountries: CountryCode[] = ["AL", "FR", "GB"];

// Fonction pour créer le schéma en fonction du mode (édition ou création)
const createSecretarySchema = (isEditMode: boolean) => {
  const baseSchema = {
    email: z.string().email("Email invalide"),
    firstname: z.string().min(2, "Le prénom est requis"),
    lastname: z.string().min(2, "Le nom est requis"),
    phoneNumber: z.string().min(10, "Numéro de téléphone invalide").optional(),
    language: z.string().min(2, "La langue est requise"),
  };

  // En mode édition, le mot de passe est optionnel et ne doit être validé que s'il est fourni
  const passwordSchema = isEditMode
    ? {
        password: z
          .union([
            z.string().length(0), // Accepte une chaîne vide
            z
              .string()
              .min(8, "Le mot de passe doit faire au moins 8 caractères"),
          ])
          .optional()
          .transform((e) => (e === "" ? undefined : e)), // Transforme une chaîne vide en undefined
      }
    : {
        password: z
          .string()
          .min(8, "Le mot de passe doit faire au moins 8 caractères"),
        acceptTerms: z.boolean().refine((val) => val, {
          message: "Vous devez accepter les conditions d'utilisation",
        }),
      };

  return z.object({
    ...baseSchema,
    ...passwordSchema,
  });
};

type SecretaryFormValues = z.infer<ReturnType<typeof createSecretarySchema>>;

interface SecretaryFormProps {
  onSuccess: () => void;
  onClose: () => void;
  user?: {
    id?: string;
    email: string;
    firstname: string;
    lastname: string;
    avatar?: string;
    phoneNumber: string;
    active: boolean;
    language: string;
  } | null;
}

export function AddSecretaryForm({
  onSuccess,
  onClose,
  user = null,
}: SecretaryFormProps) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { createUser, updateUser, savePhotoUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(
    user?.avatar || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!user;
  const doctorSchema = createSecretarySchema(isEditMode);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SecretaryFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: user
      ? {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phoneNumber: user.phoneNumber,
          password: "", // Ne pas pré-remplir le mot de passe pour des raisons de sécurité
          language: user.language,
        }
      : {
          email: "",
          firstname: "",
          lastname: "",
          phoneNumber: "",
          password: "",
          acceptTerms: false,
        },
  });

  const onSubmit = async (data: SecretaryFormValues) => {
    try {
      setIsLoading(true);
      // Créer l'objet de base avec les champs communs
      const baseUserData = {
        ...(isEditMode && user?.id && { id: user.id }), // Inclure l'ID seulement en mode édition
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        phoneNumber: data.phoneNumber,
        // Ne pas envoyer le mot de passe s'il est vide (mode édition sans modification du mot de passe)
        ...(data.password && { password: data.password }),
        roleId: UserRole.SECRETARY,
        active: user?.active,
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
          {!isEditMode && (
            <>
              <Label>Mot de passe temporaire</Label>
              <Input
                type="password"
                {...register("password")}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </>
          )}
          {isEditMode && (
            <div className="space-y-2">
              <Label>
                Changer le mot de passe (laisser vide pour ne pas modifier)
              </Label>
              <Input
                type="password"
                {...register("password")}
                autoComplete="new-password"
                placeholder="Nouveau mot de passe"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
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
              <SelectValue placeholder="Sélectionnez une spécialité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="sq" value="sq">
                Shqip
              </SelectItem>
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
