import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState } from 'react';
import { useUser } from '@/services/user/useUser';

// Fonction pour créer le schéma dynamique avec les traductions
const createContactSchema = (t: any) => z.object({
  name: z.string().min(2, t.contact.form.nameRequired || 'Le nom est requis'),
  phone: z.string().min(10, t.contact.form.phoneRequired || 'Le téléphone est requis'),
  email: z.string().email(t.contact.form.emailRequired || 'Email invalide'),
  message: z.string().min(10, t.contact.form.messageRequired || 'Le message est requis'),
});

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>> & {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const { t } = useLanguage();
  const { sendContactMessage } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(createContactSchema(t)),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsLoading(true);
    try {
      // TODO: Appeler l'API pour envoyer le message de contact
      await sendContactMessage(values);

      // Simulation de l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: t.contact.form.success || 'Message envoyé',
        description: t.contact.form.successDescription || 'Votre message a été envoyé avec succès',
      });

      // Réinitialiser le formulaire
      form.reset();
    } catch (error) {
      toast({
        title: t.auth.error || 'Erreur',
        description: error.message || t.contact.form.errorDescription || 'Impossible d\'envoyer votre message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground mb-2"
        >
          {t.contact.form.name}
        </label>
        <Input
          id="name"
          type="text"
          placeholder={t.contact.form.name}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground mb-2"
        >
          {t.contact.form.phone}
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder={t.contact.form.phone}
          {...form.register('phone')}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
          {t.contact.form.email}
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@gmail.com"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-2"
        >
          {t.contact.form.message}
        </label>
        <Textarea
          id="message"
          rows={5}
          placeholder={t.contact.form.messagePlaceholder}
          {...form.register('message')}
        />
        {form.formState.errors.message && (
          <p className="text-sm text-red-500">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>

      <Button size="lg" variant="hero" className="w-full" disabled={isLoading}>
        {isLoading ? (t.contact.form.sending || 'Envoi en cours...') : t.contact.form.submit}
      </Button>
    </form>
  );
}
