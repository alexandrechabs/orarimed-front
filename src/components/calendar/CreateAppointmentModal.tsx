import { useRef, useState } from 'react';
import { addHours, addMinutes, format } from 'date-fns';
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
import { Calendar as CalendarIcon } from 'lucide-react';

import { useAuth } from '@/services/auth/useAuth';
import { useEffect } from 'react';

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
  patient: {
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
  eventKind?: 'appointment' | 'absence';
}

/* ----------------------------------------
   ZOD SCHEMA (métier)
----------------------------------------- */

const formSchema = z
  .object({
    eventKind: z.enum(['appointment', 'absence']),
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
      .nullable(),
  })
  .refine((data) => data.eventKind === 'absence' || data.patient !== null, {
    path: ['patient'],
    message: 'Un patient est obligatoire pour un rendez-vous',
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    path: ['endDate'],
    message: 'La fin doit être après le début',
  })
  .refine(
    (data) => data.repeatType === 'none' || data.repeatEndDate !== undefined,
    {
      path: ['repeatEndDate'],
      message: 'Une date de fin est requise pour une répétition',
    }
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
  const { user } = useAuth();
  const { results, search, clear } = usePatientSearch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventKind: 'appointment',
      title: 'Consultation',
      description: '',
      startDate: new Date(),
      endDate: undefined,
      isAllDay: false,
      repeatType: 'none',
      repeatEndDate: undefined,
      patient: null,
    },
  });

  const appointmentTitles = [
    { name: 'Consultation', color: '#339991', type: 'appointment', time: 15 },
    { name: 'Contrôle', color: '#00ff00', type: 'appointment', time: 30 },
    { name: 'Urgence', color: '#0000ff', type: 'appointment', time: 15 },
    {
      name: 'Bilan de santé',
      color: '#ffff00',
      type: 'appointment',
      time: 15,
    },
    { name: 'Suivi', color: '#ff00ff', type: 'appointment', time: 15 },
    { name: 'Autre', color: '#00ffff', type: 'appointment', time: 15 },
    { name: 'Absence', color: '#ff0000', type: 'absence' },
  ];

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const eventKind = watch('eventKind');
  const isAllDay = watch('isAllDay');

  const startDate = useWatch({ control, name: 'startDate' });
  const title = useWatch({ control, name: 'title' });

  const didInit = useRef<false | 'initialized' | 'ready'>(false);

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
      : addMinutes(start, 15);

    form.reset({
      eventKind:
        (eventToEdit as any)?.extendedProps?.eventKind || 'appointment',
      title: eventToEdit?.title || 'Consultation',
      description: eventToEdit?.description || '',
      startDate: start,
      endDate: end,
      isAllDay: eventToEdit?.allDay || false,
      repeatType: 'none',
      repeatEndDate: undefined,
      patient: null,
    });
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
    console.log('Données du formulaire :', data);

    const event = buildRecurringEvent(data, user.id);

    console.log('plop');

    if (eventToEdit) {
      onEventUpdated(event);
    } else {
      onEventCreated(event);
    }
    onOpenChange(false);
  };

  function buildRecurringEvent(
    data: FormValues,
    userId: string
  ): CalendarEvent {
    const base: CalendarEvent = {
      id: eventToEdit?.id,
      title: data.title || 'Nouvel événement',
      description: data.description,
      allDay: data.isAllDay,
      practitionerId: userId,
      color: appointmentTitles.find((i) => i.name === data.title)?.color,
      patient: {
        id: data.patient?.id,
        firstname: data.patient?.firstname,
        lastname: data.patient?.lastname,
        email: data.patient?.email,
        phoneNumber: data.patient?.phoneNumber,
      },
    };

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
                    eventToEdit?.eventKind === 'absence'
                      ? "l'absence"
                      : 'le rendez-vous'
                  }`
                : 'Nouvel événement'}
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
                  name="eventKind"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue(
                          'title',
                          appointmentTitles.filter((t) => t.type === value)[0]
                            .name
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment">Rendez-vous</SelectItem>
                        <SelectItem value="absence">Absence</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* TITRE */}
            <div className="mt-2">
              <Label>Motif</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      const selected = appointmentTitles.find(
                        (t) => t.name === value
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
                        .filter((t) => t.type === eventKind)
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
            {eventKind === 'appointment' && (
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
                                  { shouldValidate: true }
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
                              date.getDate()
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
                              date.getDate()
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
