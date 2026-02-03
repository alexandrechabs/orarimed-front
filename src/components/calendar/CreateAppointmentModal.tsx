import { useRef, useState } from 'react';
import { addMinutes, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useWatch } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, Settings } from 'lucide-react';

import { useAuth } from '@/services/auth/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function usePatientSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    // const res = await fetch(`/api/patients/search?query=${query}`);
    // const data = await res.json();
    setResults([
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
      },
    ]);
    setLoading(false);
  };

  const clear = () => setResults([]);

  return { results, loading, search, clear };
}

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  allDay: boolean;
  patient?: {
    id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
  };
  color: string;
  practitionerId: string;
  // Pour les événements uniques
  start?: string | Date;
  end?: string | Date;
  // Pour les événements récurrents
  startRecur?: string;
  endRecur?: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  // Propriétés étendues
  type?: 'appointment' | 'absence';
}

/* ----------------------------------------
   ZOD SCHEMA (métier)
----------------------------------------- */

const formSchema = z
  .object({
    type: z.enum(['appointment', 'absence']),
    title: z.string().optional(),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    isAllDay: z.boolean(),
    repeatType: z.enum(['none', 'daily', 'dailyWeek', 'weekly']),
    repeatEndDate: z.date().optional(),
    patient: z
      .object({
        firstname: z.string().min(1, 'Prénom obligatoire'),
        lastname: z.string().min(1, 'Nom obligatoire'),
        email: z.string().email('Email invalide').optional(),
        phoneNumber: z.string().optional(),
        id: z.number().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'absence') return true;

      // Si c'est un rendez-vous, on vérifie que le patient est valide
      return (
        data.patient &&
        typeof data.patient === 'object' &&
        data.patient.firstname &&
        data.patient.lastname
      );
    },
    {
      path: ['patient'],
      message:
        'Un patient avec un nom et un prénom est obligatoire pour une consultation',
    },
  )
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    path: ['endDate'],
    message: 'La fin doit être après le début',
  })
  .refine(
    (data) => data.repeatType === 'none' || data.repeatEndDate !== undefined,
    {
      path: ['repeatEndDate'],
      message: 'Une date de fin est requise pour une répétition',
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  eventToEdit?: CalendarEvent;
  onEventCreated?: (event: CalendarEvent) => void;
  onEventUpdated?: (event: CalendarEvent) => void;
}

/* ----------------------------------------
   COMPONENT
----------------------------------------- */
export default function CreateAppointmentModal({
  open,
  onOpenChange,
  initialDate,
  eventToEdit,
  onEventCreated,
  onEventUpdated,
}: Props) {
  const navigate = useNavigate();
  const { user, getReasons } = useAuth();
  const { results, search, clear } = usePatientSearch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'appointment',
      title: 'Consultation',
      description: '',
      startDate: new Date(),
      endDate: addMinutes(new Date(), 15),
      isAllDay: false,
      repeatType: 'none',
      repeatEndDate: undefined,
      patient: {
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
      },
    },
  });

  let [appointmentTitles, setAppointmentTitles] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const type = watch('type');

  const startDate = useWatch({ control, name: 'startDate' });
  const title = useWatch({ control, name: 'title' });

  const didInit = useRef<false | 'initialized' | 'ready'>(false);

  useEffect(() => {
    getReasons().then((reasons) => {
      setAppointmentTitles(reasons);
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    didInit.current = false;
    const start = eventToEdit?.start
      ? new Date(eventToEdit.start)
      : initialDate
        ? new Date(initialDate)
        : new Date();

    const end = eventToEdit?.end
      ? new Date(eventToEdit.end)
      : addMinutes(start, 30);

    const type = (eventToEdit as any)?.extendedProps?.type || 'appointment';
    const defaultTitle =
      type === 'absence'
        ? appointmentTitles.filter((i) => i.type === 'absence')[0]?.name
        : appointmentTitles.filter((i) => i.type === 'appointment')[0]?.name;

    form.reset({
      type,
      title: eventToEdit?.title || defaultTitle,
      description: eventToEdit?.description || '',
      startDate: start,
      endDate: end,
      isAllDay: eventToEdit?.allDay || false,
      repeatType: 'none',
      repeatEndDate: undefined,
      patient:
        type === 'appointment'
          ? {
              id: eventToEdit?.patient?.id,
              firstname: eventToEdit?.patient?.firstname || '',
              lastname: eventToEdit?.patient?.lastname || '',
              email: eventToEdit?.patient?.email || '',
              phoneNumber: eventToEdit?.patient?.phoneNumber || '',
            }
          : null,
    });

    // add title in appointmentTitles if not found
    const reason = appointmentTitles.find((r) => r.name === eventToEdit?.title);
    if (!reason) {
      setAppointmentTitles((prev) => [
        ...prev,
        {
          name: eventToEdit?.title,
          color: eventToEdit?.color,
          type: eventToEdit?.type,
          time: 30,
        },
      ]);
    }
  }, [open, initialDate, eventToEdit, form]);

  useEffect(() => {
    if (!startDate) return;

    if (!didInit.current) {
      didInit.current = 'initialized';
      return;
    }

    // Si on est en mode édition et que c'est le premier rendu après l'ouverture
    if (eventToEdit && didInit.current === 'initialized') {
      didInit.current = 'ready';
      return;
    }

    let time = 15;
    const selected = appointmentTitles.find((i) => i.name === title);
    if (selected?.time) {
      time = selected.time;
    }

    setValue('endDate', addMinutes(startDate, time), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [startDate, title, setValue]);

  /* ----------------------------------------
     SUBMIT
  ----------------------------------------- */
  const onSubmit = (data: FormValues) => {
    const event = buildRecurringEvent(data, user.id);

    if (eventToEdit) {
      onEventUpdated(event);
    } else {
      onEventCreated(event);
    }
    onOpenChange(false);
  };

  function buildRecurringEvent(
    data: FormValues,
    userId: string,
  ): CalendarEvent {
    let base: CalendarEvent = {
      id: eventToEdit?.id,
      title: data.title || 'Nouvel événement',
      type: data.type,
      description: data.description,
      allDay: data.isAllDay,
      practitionerId: userId,
      color: appointmentTitles.find((i) => i.name === data.title)?.color,
    };

    if (data.type === 'appointment' && data.patient) {
      base.patient = {
        id: data.patient.id,
        firstname: data.patient.firstname,
        lastname: data.patient.lastname,
        email: data.patient.email,
        phoneNumber: data.patient.phoneNumber,
      };
    }

    if (data.repeatType === 'none') {
      return {
        ...base,
        start: data.startDate.toISOString(),
        end: data.endDate?.toISOString(),
      };
    }

    // Pour les événements récurrents
    const daysOfWeek =
      data.repeatType === 'daily'
        ? [0, 1, 2, 3, 4, 5, 6]
        : data.repeatType === 'dailyWeek'
          ? [1, 2, 3, 4, 5]
          : [data.startDate.getDay()];

    return {
      ...base,
      startRecur: data.startDate.toISOString().split('T')[0],
      endRecur: data.repeatEndDate?.toISOString().split('T')[0],
      startTime: data.isAllDay ? undefined : format(data.startDate, 'HH:mm'),
      endTime: data.isAllDay
        ? undefined
        : format(data.endDate || data.startDate, 'HH:mm'),
      daysOfWeek,
    };
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh]">
        <ScrollArea className="max-h-[90vh] pr-2">
          <DialogHeader>
            <DialogTitle className="m-4 text-center">
              {eventToEdit
                ? `Modifier ${
                    eventToEdit?.type === 'absence'
                      ? "l'absence"
                      : 'la consultation'
                  }`
                : 'Nouvelle consultation'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.error('Erreurs de validation :', errors);
            })}
            className="space-y-4 m-1"
          >
            {/* TYPE */}
            <div className="flex items-center space-x-2">
              <div className="w-1/2">
                <Label>Type</Label>
              </div>
              <div className="w-1/2">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        const newType = value as 'appointment' | 'absence';
                        field.onChange(newType);

                        // Mettre à jour le titre en fonction du type d'événement
                        const newTitle =
                          appointmentTitles.find((t) => t.type === newType)
                            ?.name || 'Nouvel événement';
                        form.setValue('title', newTitle);

                        // Si on change pour une absence, on réinitialise le patient
                        if (newType === 'absence') {
                          form.setValue('patient', undefined, {
                            shouldValidate: true,
                          });
                        } else {
                          // Si on change pour un rendez-vous, on initialise un patient vide
                          form.setValue(
                            'patient',
                            {
                              firstname: '',
                              lastname: '',
                              email: '',
                              phoneNumber: '',
                            },
                            { shouldValidate: true },
                          );
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment">
                          Consultation
                        </SelectItem>
                        <SelectItem value="absence">Absence</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* TITRE */}
            <div className="mt-2">
              <div className="flex items-center gap-2 my-2">
                <Label>Motif</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() =>
                    navigate('/doctor-settings?tab=consultation-reasons')
                  }
                  title="Gérer les motifs de consultation"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      const selected = appointmentTitles.find(
                        (t) => t.name === value,
                      );
                      if (selected) {
                        field.onChange(selected.name);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un motif" />
                    </SelectTrigger>

                    <SelectContent>
                      {appointmentTitles
                        .filter((t) => t.type === type)
                        .map((title) => (
                          <SelectItem key={title.name} value={title.name}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-5 w-5 rounded"
                                style={{ backgroundColor: title.color }}
                              />
                              {title.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-2">
              <Label>Description</Label>
              <Textarea className="mt-2" {...register('description')} />
            </div>

            {/* PATIENT */}
            {type === 'appointment' && (
              <div className="mt-2 space-y-4 relative">
                <Label>Patient</Label>

                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-1/2">
                    {/* NOM + RECHERCHE */}
                    <div className="relative">
                      <Controller
                        name="patient.lastname"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nom"
                            autoComplete="off"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              search(e.target.value);
                            }}
                          />
                        )}
                      />
                      {/* Résultats de recherche */}
                      {results.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow">
                          {results.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="w-full px-3 py-2 text-left hover:bg-muted"
                              onClick={() => {
                                setValue(
                                  'patient',
                                  {
                                    id: p.id,
                                    firstname: p.firstname,
                                    lastname: p.lastname,
                                    email: p.email,
                                    phoneNumber: p.phoneNumber,
                                  },
                                  { shouldValidate: true },
                                );
                                clear();
                              }}
                            >
                              <div className="font-medium">
                                {p.lastname} {p.firstname}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {p.email || p.phoneNumber}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    {/* PRÉNOM */}
                    <Input
                      placeholder="Prénom"
                      value={watch('patient.firstname') ?? ''}
                      {...register('patient.firstname')}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  {/* CONTACT */}
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Email"
                      value={watch('patient.email') ?? ''}
                      {...register('patient.email')}
                    />
                    <Input
                      placeholder="Téléphone"
                      value={watch('patient.phoneNumber') ?? ''}
                      {...register('patient.phoneNumber')}
                    />
                  </div>
                </div>

                {errors.patient && (
                  <p className="text-red-500 text-sm">
                    {errors.patient.message}
                  </p>
                )}
              </div>
            )}

            {/* ALL DAY */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isAllDay"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Toute la journée</Label>
            </div>

            {/* DATE */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date de début */}
              <div>
                <Label>Date de début</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(field.value, 'PPP', { locale: fr })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;
                            const newDate = new Date(field.value);
                            newDate.setFullYear(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                            );
                            field.onChange(newDate);
                          }}
                          locale={fr}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              {/* Heure de début */}
              {!watch('isAllDay') && (
                <div>
                  <Label>Heure de début</Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="time"
                        value={format(field.value, 'HH:mm')}
                        onChange={(e) => {
                          const [h, m] = e.target.value.split(':');
                          const newDate = new Date(field.value);
                          newDate.setHours(+h, +m);
                          field.onChange(newDate);
                        }}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date de fin */}
              <div>
                <Label>Date de fin</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, 'PPP', { locale: fr })
                            : 'Choisir une date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date || !field.value) return;
                            const newDate = new Date(field.value);
                            newDate.setFullYear(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                            );
                            field.onChange(newDate);
                          }}
                          locale={fr}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              {/* Heure de fin */}
              {!watch('isAllDay') && (
                <div>
                  <Label>Heure de fin</Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="time"
                        value={field.value ? format(field.value, 'HH:mm') : ''}
                        onChange={(e) => {
                          if (!field.value) return;
                          const [h, m] = e.target.value.split(':');
                          const newDate = new Date(field.value);
                          newDate.setHours(+h, +m);
                          field.onChange(newDate);
                        }}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Répétition</Label>
              <Controller
                name="repeatType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ne pas répéter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ne pas répéter</SelectItem>
                      <SelectItem value="daily">Tous les jours</SelectItem>
                      <SelectItem value="dailyWeek">
                        Du lundi au vendredi
                      </SelectItem>
                      <SelectItem value="weekly">
                        Toutes les semaines
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {watch('repeatType') !== 'none' && (
              <div>
                <Label>Répéter jusqu’au</Label>
                <Controller
                  name="repeatEndDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, 'PPP', { locale: fr })
                            : 'Choisir une date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={fr}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.repeatEndDate && (
                  <p className="text-sm text-red-500">
                    {errors.repeatEndDate.message}
                  </p>
                )}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {eventToEdit ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
