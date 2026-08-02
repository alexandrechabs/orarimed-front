// src/components/auth/ForgotPasswordForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import { useAuth } from "@/services/auth/useAuth";

const forgotPasswordSchema = (formError: { email: string }) =>
  z.object({
    email: z.string().email(formError.email),
  });

type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const { sendResetCode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(t.auth.formError)),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      // TODO: Appeler l'API pour envoyer le code de réinitialisation
      await sendResetCode(values.email);

      toast({
        title: t.forgotPassword.success,
        description: t.forgotPassword.successDescription,
      });

      // Rediriger vers la page de réinitialisation avec l'email en paramètre
      navigate("/reset-password", { state: { email: values.email } });
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.forgotPassword.errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder={t.auth.email}
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{t.forgotPassword.error}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t.forgotPassword.sending : t.forgotPassword.valid}
      </Button>
    </form>
  );
}
