// src/pages/onboarding/steps/PersonalInfoStep.tsx
import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';

// UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AddressAutocomplete } from '@/components/Autocomplete';
import { cn } from '@/lib/utils';
import { useDateLocale, useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';

// Types
interface FormData {
  phoneNumber: string;
  rppsNumber: string;
  specialityId: number;
  subSpecialityIds: number[];
  city: string;
  country: string;
  coordinate: string;
  gender: string;
  birthDate: string;
  [key: string]: any; // For dynamic access
}

interface PersonalInfoStepProps {
  onNext: (data: { personal: FormData }) => void;
  onBack: () => void;
  data: Partial<FormData>;
}

export function PersonalInfoStep({
  onNext,
  onBack,
  data,
}: PersonalInfoStepProps) {
  const { specialities } = useAuth();
  const { language } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateLocale = useDateLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext();

  // Set initial values if they exist in data
  useEffect(() => {
    if (data) {
      const fieldsToSet = {
        phoneNumber: data.phoneNumber || '',
        rppsNumber: data.rppsNumber || '',
        specialityId: data.specialityId || '',
        subSpecialityIds: data.subSpecialityIds || [],
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        coordinate: data.coordinate || '',
        gender: data.gender || '',
        birthDate: data.birthDate || '',
      };

      Object.entries(fieldsToSet).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [data, setValue]);

  const allowedCountries: CountryCode[] = ['AL', 'FR', 'GB'];

  const onSubmit = (formData: FormData) => {
    if (formData.birthDate) {
      const date = new Date(formData.birthDate);
      formData.birthDate = date.toISOString().split('T')[0];
    }
    const data = { personal: formData };
    onNext(data);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onBack();
  };

  return (
    <form
      id="onboarding-form-0"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Téléphone professionnel</Label>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: 'Ce champ est requis' }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              international
              defaultCountry="AL"
              countries={allowedCountries}
              value={value}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="+33 6 12 34 56 78"
            />
          )}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">
            {errors.phoneNumber.message?.toString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Genre</Label>
          <Select
            onValueChange={(value) => setValue('gender', value)}
            defaultValue={watch('gender')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register('gender', {
              required: 'Veuillez sélectionner votre genre',
            })}
          />
          {errors.gender && (
            <p className="text-sm text-red-500">
              {errors.gender.message?.toString()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date de naissance</Label>
          <Controller
            name="birthDate"
            control={control}
            rules={{
              required: 'Veuillez entrer votre date de naissance',
              validate: (value) => {
                if (!value) return 'Veuillez entrer une date de naissance';
                const birthDate = new Date(value);
                const today = new Date();
                const minDate = new Date();
                minDate.setFullYear(today.getFullYear() - 100);

                if (birthDate > today) {
                  return 'La date de naissance ne peut pas être dans le futur';
                }
                if (birthDate < minDate) {
                  return 'Veuillez entrer une date de naissance valide';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'PPP', {
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
                      dropdown_month: 'px-2 py-1 rounded-md border text-sm',
                      dropdown_year: 'px-2 py-1 rounded-md border text-sm',
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
            )}
          />
          {errors.birthDate && (
            <p className="text-sm text-red-500">
              {errors.birthDate.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="speciality">Spécialité médicale</Label>
        <Select
          onValueChange={(value) => {
            setValue('specialityId', Number(value));
            setValue('subSpecialityIds', []);
          }}
          defaultValue={watch('specialityId')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une spécialité" />
          </SelectTrigger>
          <SelectContent>
            {specialities.map((speciality) => (
              <SelectItem key={speciality.id} value={speciality.id.toString()}>
                {
                  speciality.translations.find((t) => t.locale === language)
                    ?.name
                }
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="hidden"
          {...register('specialityId', {
            required: 'Veuillez sélectionner une spécialité',
          })}
        />
        {errors.specialityId && (
          <p className="text-sm text-red-500">
            {errors.speciality.message?.toString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Sous-spécialités (optionnel)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {specialities
            .find((s) => s.id === Number(watch('specialityId')))
            ?.subSpecialities.map((sub) => (
              <div key={sub.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`sub-${sub.id}`}
                  value={sub.id}
                  checked={watch('subSpecialityIds')?.includes(sub.id) || false}
                  onChange={(e) => {
                    const currentIds = watch('subSpecialityIds') || [];
                    const newIds = e.target.checked
                      ? [...currentIds, sub.id]
                      : currentIds.filter((id) => id !== sub.id);
                    setValue('subSpecialityIds', newIds);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`sub-${sub.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {sub.translations?.find((t) => t.locale === language)?.name ||
                    sub.name}
                </label>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rppsNumber">Numéro RPPS</Label>
        <Input
          id="rppsNumber"
          placeholder="12345678901"
          {...register('rppsNumber', { required: 'Ce champ est requis' })}
        />
        {errors.rppsNumber && (
          <p className="text-sm text-red-500">
            {errors.rppsNumber.message?.toString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse du cabinet</Label>
        <Controller
          name="address"
          control={control}
          rules={{ required: 'Veuillez saisir une adresse' }}
          render={({ field: { onChange, value } }) => (
            <AddressAutocomplete
              value={value}
              onChange={onChange}
              onPlaceSelected={(place) => {
                // Vous pouvez accéder aux détails de l'adresse ici si nécessaire
                setValue('address', place.formatted_address);
                setValue(
                  'city',
                  place.address_components.find((component) =>
                    component.types.includes('locality'),
                  ).long_name,
                );
                setValue(
                  'country',
                  place.address_components.find((component) =>
                    component.types.includes('country'),
                  ).long_name,
                );
                setValue('coordinate', {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                });
              }}
              placeholder="Saisissez l'adresse de votre cabinet"
            />
          )}
        />
        {errors.address && (
          <p className="text-sm text-red-500">
            {errors.address.message?.toString()}
          </p>
        )}
      </div>
    </form>
  );
}
