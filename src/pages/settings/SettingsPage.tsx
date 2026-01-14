import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';
import PhoneInput from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import OpeningHoursForm from '@/components/opening-hours/OpeningHoursForm';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<Theme>('system');
  const [formData, setFormData] = useState({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const allowedCountries: CountryCode[] = ['AL', 'FR', 'GB'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name?: string
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
    await updateUser(formData);

    // TODO: Implémenter la sauvegarde des paramètres
    console.log('Paramètres sauvegardés');
  };

  return (
    <div className="mx-auto py-8 space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {user.roleId === 2 && (
              <TabsTrigger value="opening-hours">
                Horaires d'ouverture
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
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
              <div className="flex justify-center">
                <Button onClick={handleSaveSettings}>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label htmlFor="notifications">
                    Activer les notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications de l'application
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
                      Notifications par email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
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
                      Notifications push
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications sur votre appareil
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user.roleId === 2 && (
          <TabsContent value="opening-hours">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des horaires d'ouverture</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configurez ici vos horaires d'ouverture pour chaque jour de la
                  semaine.
                </p>
              </CardHeader>
              <CardContent>
                <OpeningHoursForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
