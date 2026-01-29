import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { Speciality } from '@/types/specialty';
import SpecialitiesManager from '@/components/admin/SpecialtiesManager';

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const { user, getSpecialities, saveSpecialities, specialities } = useAuth();

  useEffect(() => {
    getSpecialities();
  }, []);

  // Récupérer les traductions
  const adminT = t.adminSettings;
  const specialitiesT = t.specialitiesManager;

  const handleSaveSpecialities = (specialities: Speciality[]) => {
    // Validation des données avant envoi
    const hasEmptyNames = specialities.some(
      (spec) =>
        !spec.translations.some((t) => t.name.trim()) ||
        spec.subSpecialities.some(
          (sub) => !sub.translations.some((t) => t.name.trim()),
        ),
    );

    if (hasEmptyNames) {
      toast({
        title: t.common.error,
        description:
          'Veuillez remplir tous les noms de spécialités et sous-spécialités',
        variant: 'destructive',
      });
      return;
    }

    // save
    saveSpecialities(specialities);

    // reload page
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des informations utilisateur...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{adminT.title}</h1>
        <p className="text-muted-foreground">{adminT.description}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            {adminT.general || 'General'}
          </TabsTrigger>
          <TabsTrigger value="users">{adminT.users || 'Users'}</TabsTrigger>
          <TabsTrigger value="specialities">
            {adminT.specialities || 'specialities'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {adminT.generalSettings || 'General Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {adminT.applicationSettings || 'Application Settings'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {adminT.applicationSettingsDescription ||
                    'Configure general application settings'}
                </p>
              </div>
              {/* Add settings form fields here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {adminT.userManagement || 'User Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {adminT.manageUsers || 'Manage Users'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {adminT.manageUsersDescription ||
                    'View and manage user accounts and permissions'}
                </p>
              </div>
              {/* Add user management components here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialities" className="space-y-4">
          <Card>
            <CardHeader style={{ padding: 14 }}>
              <CardTitle>{adminT.manageSpecialities}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {adminT.manageSpecialitiesDescription}
              </p>
            </CardHeader>
            <CardContent style={{ padding: 14 }}>
              <SpecialitiesManager
                onSave={handleSaveSpecialities}
                // Vous pouvez passer des données initiales ici si nécessaire
                initialData={specialities}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
