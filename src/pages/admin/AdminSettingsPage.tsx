import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/services/auth/useAuth";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Speciality } from "@/types/specialty";
import SpecialitiesManager from "@/components/admin/SpecialtiesManager";
import UserList from "@/components/admin/UserList";
import CenterList from "@/components/admin/CenterList";

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const { user, getSpecialities, saveSpecialities, specialities } = useAuth();

  useEffect(() => {
    getSpecialities();
  }, []);

  // Récupérer les traductions
  const adminT = t.adminSettings;

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
        description: adminT.speciality.specialityError,
        variant: "destructive",
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
        <p>{t.common.loading}</p>
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
        <TabsList className="inline-table">
          <TabsTrigger value="general">
            {adminT.menu.general || "General"}
          </TabsTrigger>
          <TabsTrigger value="office">
            {adminT.menu.office || "Office"}
          </TabsTrigger>
          <TabsTrigger value="doctor">
            {adminT.menu.doctor || "Doctor"}
          </TabsTrigger>
          <TabsTrigger value="secretary">
            {adminT.menu.secretary || "Secretary"}
          </TabsTrigger>
          <TabsTrigger value="specialities">
            {adminT.menu.specialities || "Specialities"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{adminT.generalSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {adminT.applicationSettings}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {adminT.applicationSettingsDescription}
                </p>
              </div>
              {/* Add settings form fields here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="office" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{adminT.office.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CenterList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Docteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <UserList type="doctor" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secretary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Secretaires</CardTitle>
            </CardHeader>
            <CardContent>
              <UserList type="secretary" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialities" className="space-y-4">
          <Card>
            <CardHeader style={{ padding: 14 }}>
              <CardTitle>{adminT.manageSpecialities}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
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
