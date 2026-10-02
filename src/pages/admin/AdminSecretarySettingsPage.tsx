import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import UserList from "@/components/admin/UserList";

export default function AdminSecretarySettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.adminSettings.menu.secretary}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList type="secretary" />
        </CardContent>
      </Card>
    </div>
  );
}
