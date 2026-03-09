import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OpeningHoursForm from '@/components/admin/OpeningHoursForm';
import DoctorCenterSearch from '@/components/admin/DoctorCenterSearch';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuth } from '@/services/auth/useAuth';
import { OpeningHour } from '@/types/openingHour';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/services/user/useUser';
import { Center } from '@/types/center';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, Shield } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ImageUpload from '@/components/ui/ImageUpload';

export default function CabinetSettingsPage() {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    getOpeningHoursCenter,
    saveOpeningHoursCenter,
    getCenter,
    updateCenter,
    getCenterDoctors,
    getDoctorCenters,
    savePhotoCenter,
  } = useUser();
  const methods = useForm({
    defaultValues: {
      openingHours: [],
    },
  });
  const centerInfoMethods = useForm({
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      country: '',
      visible: true,
      active: true,
    },
  });
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'info';
  const { handleSubmit, setValue, watch, reset } = methods;
  const {
    handleSubmit: centerInfoHandleSubmit,
    watch: centerInfoWatch,
    reset: centerInfoReset,
    setValue: centerInfoSetValue,
  } = centerInfoMethods;
  const { toast } = useToast();
  const [center, setCenter] = useState<Center | null>(null);
  const [centerDoctors, setCenterDoctors] = useState<any[]>([]);
  const [doctorCenters, setDoctorCenters] = useState<Center[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [isCenterAdmin, setIsCenterAdmin] = useState<boolean>(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(
    center?.avatar || null,
  );

  useEffect(() => {
    // Récupérer les centres du docteur
    getDoctorCenters(user.id).then((doctorCenters) => {
      console.log(doctorCenters);
      setDoctorCenters(doctorCenters || []);

      // Sélectionner le premier centre par défaut si aucun n'est sélectionné
      if (doctorCenters && doctorCenters.length > 0 && !selectedCenterId) {
        setSelectedCenterId(doctorCenters[0].id?.toString() || '');
      }
    });
  }, [user]);

  useEffect(() => {
    // Charger les données du centre sélectionné
    if (selectedCenterId) {
      getCenter(selectedCenterId).then((centerData) => {
        if (centerData) {
          setCenter(centerData);
          centerInfoReset({
            name: centerData.name || '',
            description: centerData.description || '',
            email: centerData.email || '',
            phoneNumber: centerData.phoneNumber || '',
            address: centerData.address || '',
            city: centerData.city || '',
            country: centerData.country || '',
            visible: centerData.visible ?? true,
            active: centerData.active ?? true,
          });
        }
      });

      getOpeningHoursCenter(selectedCenterId).then((openingHours) => {
        if (openingHours) {
          reset({
            openingHours: openingHours,
          });
        }
      });

      getCenterDoctors(selectedCenterId).then((doctors) => {
        setCenterDoctors(doctors || []);

        // Vérifier si le docteur actuel est admin de ce centre
        const currentUserInCenter = doctors?.find(
          (doctor: any) => doctor.id === user.id,
        );
        setIsCenterAdmin(currentUserInCenter?.isAdmin || false);
      });
    }
  }, [selectedCenterId]);

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
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      // Créer FormData pour l'envoi
      const formData = new FormData();
      formData.append('file', file);

      await savePhotoCenter(formData, selectedCenterId);
      getCenter(selectedCenterId).then((centerData) => {
        if (centerData) {
          setCenter(centerData);
          centerInfoReset({
            name: centerData.name || '',
            description: centerData.description || '',
            email: centerData.email || '',
            phoneNumber: centerData.phoneNumber || '',
            address: centerData.address || '',
            city: centerData.city || '',
            country: centerData.country || '',
            visible: centerData.visible ?? true,
            active: centerData.active ?? true,
          });
        }
      });

      setIsCropModalOpen(false);
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image:", error);
      alert("Une erreur est survenue lors du téléversement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitOpeningHours = (formData: { openingHours: OpeningHour[] }) => {
    let openingHours = formData.openingHours;
    openingHours.forEach((openingHour) => {
      openingHour.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    saveOpeningHoursCenter(selectedCenterId, openingHours);
    toast({
      title: 'Succès',
      description:
        "Les heures d'ouverture du cabinet ont été enregistrées avec succès.",
    });
  };

  const onSubmitCenterInfo = (formData: Partial<Center>) => {
    if (!center) return;

    updateCenter(center.id!, formData as Center)
      .then(() => {
        toast({
          title: 'Succès',
          description:
            'Les informations du cabinet ont été mises à jour avec succès.',
        });
        setCenter({ ...center, ...formData });
      })
      .catch((error) => {
        toast({
          title: 'Erreur',
          description:
            'Une erreur est survenue lors de la mise à jour des informations du cabinet.',
          variant: 'destructive',
        });
      });
  };

  const handleDoctorsUpdated = () => {
    if (selectedCenterId) {
      getCenterDoctors(selectedCenterId).then((doctors) => {
        setCenterDoctors(doctors || []);
      });
    }
  };

  if (doctorCenters.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Paramètres du Cabinet
          </h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              Vous n'êtes associé à aucun cabinet. Contactez un administrateur
              pour être ajouté à un cabinet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight">Chargement...</h1>
        </div>
      </div>
    );
  }

  // Message d'avertissement si l'utilisateur n'est pas admin du centre
  if (!isCenterAdmin) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
        <div className="grid md:flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Paramètres du Cabinet
          </h1>

          {doctorCenters.length > 1 && (
            <div className="flex items-center space-x-2 mt-6 md:mt-0">
              <Label htmlFor="center-select">Cabinet:</Label>
              <Select
                value={selectedCenterId}
                onValueChange={setSelectedCenterId}
              >
                <SelectTrigger id="center-select" className="w-48">
                  <SelectValue placeholder="Sélectionner un cabinet" />
                </SelectTrigger>
                <SelectContent>
                  {doctorCenters.map((center) => (
                    <SelectItem
                      key={center.id}
                      value={center.id?.toString() || ''}
                    >
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="text-6xl text-gray-300">🔒</div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Accès limité
                </h3>
                <p className="text-gray-500 mt-2">
                  Vous n'avez pas les droits d'administration pour ce cabinet.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Contactez un administrateur du cabinet pour obtenir les droits
                  de modification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      <div className="grid md:flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Paramètres du Cabinet
          </h1>
          {isCenterAdmin && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </div>
          )}
        </div>

        {doctorCenters.length > 1 && (
          <div className="flex items-center space-x-2 mt-6 md:mt-0">
            <Label htmlFor="center-select">Cabinet:</Label>
            <Select
              value={selectedCenterId}
              onValueChange={setSelectedCenterId}
            >
              <SelectTrigger id="center-select" className="w-48">
                <SelectValue placeholder="Sélectionner un cabinet" />
              </SelectTrigger>
              <SelectContent>
                {doctorCenters.map((center) => (
                  <SelectItem
                    key={center.id}
                    value={center.id?.toString() || ''}
                  >
                    {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="inline-table">
          <TabsTrigger value="info">Informations du cabinet</TabsTrigger>
          <TabsTrigger value="opening-hours">Horaires d'ouverture</TabsTrigger>
          <TabsTrigger value="doctors">Gestion des docteurs</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informations du cabinet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormProvider {...centerInfoMethods}>
                <form
                  onSubmit={centerInfoHandleSubmit(onSubmitCenterInfo)}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <div className="relative group">
                      <Avatar className="h-40 w-40">
                        <AvatarImage
                          src={
                            center?.avatar
                              ? `${API_URL}/center/${center.id}/avatar/${center.avatar}`
                              : 'hopital.png'
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
                        <span className="sr-only">
                          Changer la photo de profil
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du cabinet</Label>
                      <Input
                        id="name"
                        {...centerInfoMethods.register('name')}
                        placeholder="Nom du cabinet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...centerInfoMethods.register('email')}
                        placeholder="email@cabinet.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Téléphone</Label>
                      <Input
                        id="phoneNumber"
                        {...centerInfoMethods.register('phoneNumber')}
                        placeholder="01 23 45 67 89"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        {...centerInfoMethods.register('city')}
                        placeholder="Paris"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      {...centerInfoMethods.register('address')}
                      placeholder="123 rue de la Santé"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      {...centerInfoMethods.register('country')}
                      placeholder="France"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...centerInfoMethods.register('description')}
                      placeholder="Description du cabinet..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="visible"
                        checked={centerInfoWatch('visible')}
                        onCheckedChange={(checked) =>
                          centerInfoSetValue('visible', checked)
                        }
                      />
                      <Label htmlFor="visible">Visible publiquement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={centerInfoWatch('active')}
                        onCheckedChange={(checked) =>
                          centerInfoSetValue('active', checked)
                        }
                      />
                      <Label htmlFor="active">Actif</Label>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opening-hours">
          <Card>
            <CardHeader>
              <CardTitle>Horaires d'ouverture du cabinet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmitOpeningHours)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Définissez les horaires d'ouverture du cabinet. Vous
                      pourrez les modifier ultérieurement.
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des docteurs du cabinet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ajoutez ou retirez des docteurs du cabinet. Vous pouvez
                  définir leurs droits d'administration.
                </p>

                {centerDoctors.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Docteurs actuels ({centerDoctors.length})
                    </h3>
                    <div className="space-y-2">
                      {centerDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              Dr {doctor.firstname} {doctor.lastname}
                            </div>
                            {doctor.isAdmin && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Ajouter un docteur
                  </h3>
                  <DoctorCenterSearch
                    centerId={center.id!}
                    centerName={center.name}
                    onSuccess={handleDoctorsUpdated}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Recadrer l'image</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="w-full max-w-md mx-auto">
              <ImageUpload
                value={tempImage || ''}
                onChange={(value) => {
                  if (value === null) {
                    setTempImage(null);
                  } else if (typeof value === 'string') {
                    setTempImage(value);
                  } else if (value instanceof File) {
                    handleImageSelect(value);
                  }
                }}
                aspect={1}
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
                'Enregistrer'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
