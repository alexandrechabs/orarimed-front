import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/services/auth/useAuth";

type AdminSettingsLayoutProps = {
  children: ReactNode;
};

export default function AdminSettingsLayout({
  children,
}: AdminSettingsLayoutProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.adminSettings.title}
        </h1>
        <p className="text-muted-foreground">{t.adminSettings.description}</p>
      </div>
      {children}
    </div>
  );
}
