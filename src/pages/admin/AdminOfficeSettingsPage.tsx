import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CenterList from "@/components/admin/CenterList";

export default function AdminOfficeSettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.adminSettings.office.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CenterList />
        </CardContent>
      </Card>
    </div>
  );
}
