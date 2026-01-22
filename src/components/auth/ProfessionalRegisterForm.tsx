// src/components/auth/ProfessionalRegisterForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';

const professionalSchema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().min(2, 'Nom requis'),
    acceptTerms: z.boolean().refine((val) => val, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export function ProfessionalRegisterForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm({
    resolver: zodResolver(professionalSchema),
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
        2
      );

      toast({
        title: 'Compte créé avec succès',
        description: 'Votre compte professionnel a été créé avec succès.',
      });

      // Rediriger vers le tableau de bord professionnel
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message || "Une erreur s'est produite",
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
            placeholder="Prénom"
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
            placeholder="Nom"
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
          placeholder="Email professionnel"
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
          placeholder="Mot de passe"
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
        Créer mon compte professionnel
      </Button>
    </form>
  );
}
