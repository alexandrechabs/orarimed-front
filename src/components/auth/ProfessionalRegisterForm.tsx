// src/components/auth/ProfessionalRegisterForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const professionalSchema = (formError: {
  email: string;
  passwordSize: string;
  passwordSame: string;
  firstname: string;
  lastname: string;
  accept: string;
}) =>
  z
    .object({
      email: z.string().email(formError.email),
      password: z.string().min(8, formError.passwordSize),
      confirmPassword: z.string(),
      firstName: z.string().min(2, formError.firstname),
      lastName: z.string().min(2, formError.lastname),
      acceptTerms: z.boolean().refine((val) => val, {
        message: formError.accept,
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: formError.passwordSame,
      path: ["confirmPassword"],
    });

export function ProfessionalRegisterForm() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm({
    resolver: zodResolver(professionalSchema(t.auth.formError)),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
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
        2,
        language,
      );

      toast({
        title: t.common.success,
        description: t.auth.registerAccount.create,
      });

      // Rediriger vers le tableau de bord professionnel
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t.common.error,
        description: error.message || t.auth.registrationError,
        variant: "destructive",
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
            {...form.register("firstName")}
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
            {...form.register("lastName")}
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
          placeholder={t.auth.form.emailProfessionnal}
          {...form.register("email")}
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
          {...form.register("password")}
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
          placeholder={t.auth.confirmPassword}
          {...form.register("confirmPassword")}
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
          {...form.register("acceptTerms")}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t.auth.form.accept1}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t.auth.form.accept2}
          </a>
        </label>
      </div>
      {form.formState.errors.acceptTerms && (
        <p className="text-sm text-red-500">
          {form.formState.errors.acceptTerms.message}
        </p>
      )}

      <Button type="submit" className="w-full">
        {t.auth.registerAccount.createButton}
      </Button>
    </form>
  );
}
