// src/components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export function LoginForm() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values) {
    try {
      await login(values.email, values.password);

      // Récupérer la page de redirection et l'état supplémentaire
      const from = location.state?.from || '/dashboard';
      const additionalState = { ...location.state };
      delete additionalState.from; // Supprimer 'from' pour éviter les conflits

      // Rediriger vers la page d'origine avec l'état préservé
      navigate(from, { state: additionalState, replace: true });
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Identifiants invalides',
        variant: 'destructive',
      });
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
          id="password"
          type="password"
          placeholder={t.auth.password}
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t.auth.forgotPassword}
        </Link>
      </div>

      <Button type="submit" className="w-full">
        {t.auth.login}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.noAccount}{' '}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          {t.auth.createAccount}
        </Link>
      </p>
    </form>
  );
}
