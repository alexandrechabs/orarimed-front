import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';
import PhoneInput from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import { Camera } from 'lucide-react';
import { useUser } from '@/services/user/useUser';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user, specialities, updateUser, getMyUser } = useAuth();
  const { saveSubSpecialities, savePhotoUser } = useUser();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    specialityId: user.specialityId?.toString() || '',
    subSpecialityIds:
      user.subSpecialitiesUsers?.map((s) => s.subSpecialityId) || [],
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(
    user?.avatar || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const allowedCountries: CountryCode[] = ['AL', 'FR', 'GB'];
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();

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

      await savePhotoUser(formData, user.id);
      await getMyUser();

      setIsCropModalOpen(false);
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image:", error);
      alert("Une erreur est survenue lors du téléversement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name?: string,
  ) => {
    // Si c'est un événement (champ normal)
    if (typeof e === 'object' && e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Si c'est une chaîne (PhoneInput)
    else if (typeof e === 'string' && name) {
      setFormData((prev) => ({
        ...prev,
        [name]: e,
      }));
    }
  };

  const handleSaveSettings = async () => {
    // update user info
    await saveSubSpecialities(user.id, formData.subSpecialityIds);
    await updateUser(formData);

    // TODO: Implémenter la sauvegarde des paramètres
    toast({
      title: 'Succès',
      description: 'Les paramètres ont été enregistrés avec succès.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t.params.title}</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="account">{t.params.account}</TabsTrigger>
            <TabsTrigger value="notifications">
              {t.params.notifications}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t.params.accountTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section Photo de profil */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative group">
                  <Avatar className="h-40 w-40">
                    <AvatarImage
                      src={
                        user?.avatar
                          ? `${API_URL}/user/${user.id}/avatar/${user.avatar}`
                          : 'default-avatar.png'
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
                    <span className="sr-only">{t.params.changePicture}</span>
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.params.clickToChange}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.params.firstname}</Label>
                  <Input
                    id="firstName"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.params.lastname}</Label>
                  <Input
                    id="lastName"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.params.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.params.phone}</Label>
                  <PhoneInput
                    international
                    name="phoneNumber"
                    countries={allowedCountries}
                    value={formData.phoneNumber}
                    onChange={(value) =>
                      handleInputChange(value || '', 'phoneNumber')
                    }
                    placeholder="Entrez votre numéro de téléphone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speciality">{t.params.speciality}</Label>
                  <Select
                    onValueChange={(value) => {
                      handleInputChange(value, 'specialityId');
                      handleInputChange('', 'subSpecialityIds');
                    }}
                    defaultValue={formData.specialityId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.params.selectSpeciality} />
                    </SelectTrigger>
                    <SelectContent>
                      {specialities.map((speciality) => (
                        <SelectItem
                          key={speciality.id}
                          value={speciality.id.toString()}
                        >
                          {
                            speciality.translations.find(
                              (t) => t.locale === language,
                            )?.name
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t.params.subSpeciality}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {specialities
                      .find((s) => s.id === Number(formData.specialityId))
                      ?.subSpecialities.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`sub-${sub.id}`}
                            value={sub.id}
                            checked={
                              formData.subSpecialityIds?.includes(sub.id) ||
                              false
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  subSpecialityIds: [
                                    ...(prev.subSpecialityIds || []),
                                    sub.id,
                                  ],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  subSpecialityIds: (
                                    prev.subSpecialityIds || []
                                  ).filter((id) => id !== sub.id),
                                }));
                              }

                              formData.subSpecialityIds = e.target.checked
                                ? [...(formData.subSpecialityIds || []), sub.id]
                                : (formData.subSpecialityIds || []).filter(
                                    (id) => id !== sub.id,
                                  );
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`sub-${sub.id}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            {sub.translations?.find(
                              (t) => t.locale === language,
                            )?.name || sub.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={handleSaveSettings}>{t.common.save}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t.params.notificationTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label htmlFor="notifications">
                    {t.params.activeNotification}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t.params.activeNotificationDetail}
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">
                      {t.params.emailNotification}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t.params.emailNotificationDetail}
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between space-x-4">
                  <div className="space-y-1">
                    <Label htmlFor="push-notifications">
                      {t.params.pushNotification}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t.params.pushNotificationDetail}
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between space-x-4">
                  <div className="space-y-1">
                    <Label htmlFor="push-notifications">
                      {t.params.smsNotification}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t.params.smsNotificationDetail}
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setSmsNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de recadrage */}
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
