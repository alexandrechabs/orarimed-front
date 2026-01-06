import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getDateLocale, useLanguage } from '@/lib/i18n/LanguageContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/services/auth/useAuth';
import React from 'react';
import PhoneInput from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

const formSchema = z.object({
  genderId: z.enum(['1', '2', '3'], {
    required_error: 'Veuillez sélectionner votre genre',
  }),
  phoneNumber: z
    .string({
      required_error: 'Le numéro de téléphone est requis',
    })
    .min(8, {
      message: 'Le numéro de téléphone est invalide',
    }),
  birthDate: z.date({
    required_error: 'Veuillez entrer votre date de naissance',
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères",
  }),
  city: z.string().min(2, {
    message: 'Veuillez entrer une ville valide',
  }),
  zipCode: z.string().min(4, {
    message: 'Code postal invalide',
  }),
  country: z.string().min(2, {
    message: 'Veuillez sélectionner un pays',
  }),
});

export function OnboardingClientPage() {
  const { t, languages, language } = useLanguage();
  const dateLocale = getDateLocale(); // ✅ PAS de hook ici
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Liste des pays disponibles avec leurs codes ISO
  const allowedCountries: CountryCode[] = ['AL', 'FR', 'GB'];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genderId: undefined,
      phoneNumber: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Préparer les données pour l'envoi
      const dataToSend = {
        ...values,
        birthDate: values.birthDate
          ? format(values.birthDate, 'yyyy-MM-dd')
          : null,
      };

      // Envoyer les données au serveur
      await updateUser(dataToSend);

      toast({
        title: 'Profil complété avec succès',
        description: 'Vos informations ont été enregistrées avec succès.',
      });

      // Rediriger vers le tableau de bord
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'enregistrement de vos informations.",
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complétez votre profil</h1>
        <p className="text-muted-foreground">
          Ces informations nous aideront à personnaliser votre expérience.
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genre */}
              <FormField
                control={form.control}
                name="genderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Homme</SelectItem>
                        <SelectItem value="2">Femme</SelectItem>
                        <SelectItem value="3">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date de naissance */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel>Date de naissance</FormLabel>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', {
                                locale: dateLocale,
                              })
                            ) : (
                              <span>Choisissez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date) {
                              setIsCalendarOpen(false);
                            }
                          }}
                          captionLayout="dropdown"
                          classNames={{
                            caption: 'flex justify-center gap-2',
                            caption_label: 'hidden',
                            dropdown: 'm-0',
                            dropdown_month:
                              'px-2 py-1 rounded-md border text-sm',
                            dropdown_year:
                              'px-2 py-1 rounded-md border text-sm',
                          }}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          locale={dateLocale}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Adresse */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Rue de l'Exemple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ville */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Code postal */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="75000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pays */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="AL">Albanie</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Numéro de téléphone avec sélecteur de pays */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PhoneInput
                          international
                          defaultCountry="AL"
                          countries={allowedCountries}
                          value={value}
                          onChange={onChange}
                          placeholder="Entrez votre numéro de téléphone"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                Enregistrer et continuer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default OnboardingClientPage;
