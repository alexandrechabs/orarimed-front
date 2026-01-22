// src/components/auth/RegisterForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    acceptTerms: z.boolean().refine((val) => val, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      acceptTerms: false,
    },
  });

  async function onSubmit(values) {
    try {
      // Ajoutez ici l'appel à votre API d'inscription
      await register(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
        values.acceptTerms,
        1
      );

      toast({
        title: t.auth.registrationSuccess,
        description: t.auth.registrationSuccessMessage,
      });

      // Rediriger vers la page de connexion ou le tableau de bord
      navigate('/login');
    } catch (error) {
      toast({
        title: t.auth.registrationError,
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            id="firstName"
            placeholder={t.auth.firstName}
            {...form.register('firstName')}
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            id="lastName"
            placeholder={t.auth.lastName}
            {...form.register('lastName')}
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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

      <div className="space-y-2">
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirmez le mot de passe"
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="acceptTerms"
          {...form.register('acceptTerms')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          J'accepte les{' '}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            conditions d'utilisation
          </a>
        </label>
      </div>
      {form.formState.errors.acceptTerms && (
        <p className="text-sm text-red-500">
          {form.formState.errors.acceptTerms.message}
        </p>
      )}

      <Button type="submit" className="w-full">
        {t.auth.createAccount}
      </Button>
    </form>
  );
}
