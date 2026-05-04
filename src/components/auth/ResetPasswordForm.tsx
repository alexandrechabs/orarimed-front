// src/components/auth/ResetPasswordForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState } from 'react';
import { useAuth } from '@/services/auth/useAuth';

// Fonction pour créer le schéma dynamique avec les traductions
const createResetPasswordSchema = (t: any) => z.object({
  email: z.string().email(t.resetPassword.emailError),
  code: z.string().min(6, t.resetPassword.codeError).max(6, t.resetPassword.codeError),
  password: z.string().min(8, t.resetPassword.passwordMinLength || 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(1, t.resetPassword.confirmPasswordRequired || 'La confirmation du mot de passe est requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: t.resetPassword.passwordsNotMatch || 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email || '';

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: {
      email: email,
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!email) {
      toast({
        title: t.common.error,
        description: t.resetPassword.emailMissing,
        variant: 'destructive',
      });
      navigate('/forgot-password');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Appeler l'API pour vérifier le code et réinitialiser le mot de passe
      await resetPassword(email, values.code, values.password);

      toast({
        title: t.resetPassword.success,
        description: t.resetPassword.successDescription,
      });

      // Rediriger vers la page de connexion
      navigate('/login');
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.resetPassword.errorDescription,
        variant: 'destructive',
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
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="code"
          type="text"
          placeholder={t.resetPassword.codePlaceholder}
          maxLength={6}
          autoComplete="off"
          {...form.register('code')}
        />
        {form.formState.errors.code && (
          <p className="text-sm text-red-500">
            {form.formState.errors.code.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="password"
          type="password"
          placeholder={t.resetPassword.newPassword}
          autoComplete="new-password"
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t.resetPassword.confirmPassword}
          autoComplete="new-password"
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t.resetPassword.sending : t.resetPassword.sendButton}
      </Button>
    </form>
  );
}
