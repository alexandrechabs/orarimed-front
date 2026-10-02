import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import UserList from "@/components/admin/UserList";

export default function AdminDoctorSettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.adminSettings.doctor.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList type="doctor" />
        </CardContent>
      </Card>
    </div>
  );
}
