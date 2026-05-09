import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeekAgenda,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useDateLocale, useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { useAuth } from '@/services/auth/useAuth';
import { EventChangeArg, EventInput } from '@fullcalendar/core/index.js';
import CreateAppointmentModal from '@/components/calendar/CreateAppointmentModal';
import { useUser } from '@/services/user/useUser';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/types/CalendarEvent';
import * as LucideIcons from 'lucide-react';
import { DoctorProfile } from '@/types/doctor';
import { User } from '@/types/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const CalendarPage = () => {
  const { user } = useAuth();
  const {
    events,
    createEvent,
    getEvents,
    updateEvent,
    openingHour,
    getOpeningHours,
    getSecretaryDoctors,
  } = useUser();
  const { t, language } = useLanguage();
  const dateLocale = useDateLocale();
  const { toast } = useToast();
  const eventsControl = useMemo(
    () => createCalendarControlsPlugin(),
    []
  )

  const eventsService = useMemo(
    () => createEventsServicePlugin(),
    []
  )
  // const localeMap: Record<string, string> = {
  //   sq: 'sq',
  //   en: 'en',
  //   fr: 'fr',
  // };
  const localeMap: Record<string, string> = {
    sq: 'sq-AL',
    en: 'en-US',
    fr: 'fr-FR',
  };
  const calendar = useCalendarApp({
    locale: localeMap[language] || 'en',
    timezone: 'Europe/Paris',
    views: [createViewDay(), createViewWeekAgenda(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    weekOptions: {
      gridStep: 15,
      eventWidth: 90,
    },
    plugins: [eventsControl, eventsService],
    callbacks: {
      onEventClick(calendarEvent, e: UIEvent) {
        handleEventClick({ event: calendarEvent });
      },
      onClickDateTime(dateTime: Temporal.ZonedDateTime, e?: UIEvent) {
        const ms = 1000 * 60 * 15 // 15 minutes
        setSelectedDate(new Date(Math.floor(dateTime.epochMilliseconds / ms) * ms));
        setEditingEvent(null);
        setIsModalOpen(true);
      },
      async fetchEvents(range) {
        const dateRange = {
          start: range.start.toString(),
          end: range.end.toString(),
        };
        getEvents(dateRange, selectedDoctor?.id);
        return []
      },
    },
  })
  const [selectedDoctor, setSelectedDoctor] = useState<
    DoctorProfile | User | null
  >(null);
  const [accessDoctors, setAccessDoctors] = useState<DoctorProfile[] | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [range, setRange] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [calendarTitle, setCalendarTitle] = useState<string>('');

  // États pour la popup de confirmation
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingEventMove, setPendingEventMove] = useState<{
    event: any;
    changeInfo: EventChangeArg;
    formattedDate: string;
    formattedTime: string;
  } | null>(null);

  useEffect(() => {
    setSelectedDoctor(user);
    if (user.roleId === 3) {
      (async () => {
        const doctors = await getSecretaryDoctors(user.id);
        setAccessDoctors(doctors);
        // get userId in url
        let userId = new URLSearchParams(window.location.search).get('userId');
        if (userId) {
          const doctor = doctors.find((d) => d.id === userId);
          if (doctor) {
            setSelectedDoctor(doctor);
            getOpeningHour(doctor.id);
          } else {
            if (doctors.length > 0) {
              setSelectedDoctor(doctors[0]);
              getOpeningHour(doctors[0].id);
            }
          }
        } else {
          if (doctors.length > 0) {
            setSelectedDoctor(doctors[0]);
            getOpeningHour(doctors[0].id);
          }
        }
      })();
    } else {
      getOpeningHour();
    }
  }, []);

  useEffect(() => {
    // Créer un intervalle qui se répète toutes les 1 minutes
    const intervalId = setInterval(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const view = calendarApi.view;

        const dateRange = {
          start: view.currentStart.toISOString(),
          end: view.currentEnd.toISOString(),
        };
        getEvents(dateRange, selectedDoctor?.id);
      }
    }, 60 * 1000); // 1 minute

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [selectedDoctor]); // Le tableau vide signifie que cet effet ne s'exécute qu'au montage/démontage

  useEffect(() => {
    eventsService.set(events.map((event: CalendarEvent) => {
      // Déterminer si c'est un événement journée complète ou avec horaires
      const isFullDay = event.allDay;
      console.log('isFullDay', isFullDay);

      if (isFullDay) {
        // Événement journée complète - utiliser PlainDate
        return {
          id: event.id || '',
          title: event.title,
          start: event.start ? Temporal.PlainDate.from(new Date(event.start).toISOString().split('T')[0]) : Temporal.Now.plainDateISO(),
          end: event.end ? Temporal.PlainDate.from(new Date(event.end).toISOString().split('T')[0]) : Temporal.Now.plainDateISO(),
          calendar: event.type === 'absence' ? 'absences' : 'appointments',
          color: event.color || '#3b82f6',
          extendedProps: {
            ...event,
            patient: event.patient,
            status: event.status,
            type: event.type,
          },
        };
      } else {
        // Événement avec horaires en utc - utiliser ZonedDateTime
        const startDate = event.start ? Temporal.Instant
          .from(event.start as string)
          .toZonedDateTimeISO("Europe/Paris") : new Date();
        const endDate = event.end ? Temporal.Instant
          .from(event.end as string)
          .toZonedDateTimeISO("Europe/Paris") : new Date();

        return {
          id: event.id || '',
          title: setTitleEvent(event),
          start: Temporal.ZonedDateTime.from(startDate.toString()),
          end: Temporal.ZonedDateTime.from(endDate.toString()),
          calendar: event.type === 'absence' ? 'absences' : 'appointments',
          color: event.color || '#3b82f6',
          extendedProps: {
            ...event,
            patient: event.patient,
            status: event.status,
            type: event.type,
          },
        };
      }
    }))
  }, [events, isVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!eventsControl?.getRange) return

      setRange(eventsControl.getRange())
    }, 300)

    return () => clearInterval(interval)
  }, [eventsControl])

  useEffect(() => {
    const diffInMs = new Date(eventsControl.getRange().end.epochMilliseconds).getTime() - new Date(eventsControl.getRange().start.epochMilliseconds).getTime();
    const nbDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
    console.log(nbDays);

    if (nbDays === 7) {
      setCalendarTitle(
        format(new Date(eventsControl.getRange().start.epochMilliseconds).getTime(), 'dd MMMM', {
          locale: dateLocale,
        }) +
        ' - ' +
        format(new Date(eventsControl.getRange().end.epochMilliseconds).getTime(), 'dd MMMM yyyy', {
          locale: dateLocale,
        })
      );
    } else if (nbDays > 7) {
      setCalendarTitle(format(new Date(eventsControl.getRange().start.epochMilliseconds).getTime(), 'MMMM yyyy', {
        locale: dateLocale,
      }));
    } else {
      setCalendarTitle(format(new Date(eventsControl.getRange().end.epochMilliseconds).getTime(), 'dd MMMM yyyy', {
        locale: dateLocale,
      }));
    }
  }, [range]);

  const setTitleEvent = (event: any) => {
    let abort = false;
    let Icon;
    if (event.status === 'waiting') {
      Icon = LucideIcons['Armchair'];
    } else if (event.status === 'consultation') {
      Icon = LucideIcons['Stethoscope'];
    } else if (event.status === 'finished') {
      Icon = LucideIcons['Check'];
    } else if (event.status === 'abortExcused') {
      Icon = LucideIcons['CalendarOff'];
      abort = true;
    } else if (event.status === 'abort') {
      Icon = LucideIcons['Ban'];
      abort = true;
    }

    // return (
    //   <div className="">
    //     <div className="font-normal whitespace-normal break-words">
    //       {event.extendedProps?.type === 'absence' ? (
    //         formatTime(event.start) + ' - ' + event.title
    //       ) : (
    //         <>
    //           <span
    //             className={`flex items-center gap-2 ${abort ? 'line-through' : ''}`}
    //           >
    //             {Icon && <Icon className="h-4 w-4 shrink-0" />}
    //             {formatTime(event.start)} -{' '}
    //             {isVisible
    //               ? event.extendedProps?.patient?.firstname
    //               : '******'}{' '}
    //             {isVisible
    //               ? event.extendedProps?.patient?.lastname
    //               : '******'}
    //           </span>
    //         </>
    //       )}
    //     </div>
    //   </div>
    // );
    return isVisible ? event.patient.firstname + ' ' + event.patient.lastname : '****** ******';
  };

  const getOpeningHour = async (doctorId?: string) => {
    getOpeningHours(doctorId || selectedDoctor?.id || user?.id).then(
      (hours) => {
        // récupère le min de hours.openTime et le max de hours.closeTime
        const minTime = hours.reduce((min, hour) => {
          return hour.openTime < min ? hour.openTime : min;
        }, hours[0].openTime);
        const maxTime = hours.reduce((max, hour) => {
          return hour.closeTime > max ? hour.closeTime : max;
        }, hours[0].closeTime);
        // enlève 1 heure au min et ajouter 1 heure au max

        const formatTimeForCalendar = (timeStr: string, diff: number) => {
          let [hours, minutes] = timeStr.split(':').map(Number);
          hours = hours + diff;

          return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;
        };

        eventsControl.setDayBoundaries({
          start: formatTimeForCalendar(minTime, -1),
          end: formatTimeForCalendar(maxTime, 1),
        });
      },
    );
  };

  const handleDatesSet = useCallback(
    (arg: { start: Date; end: Date }) => {
      const dateRange = {
        start: arg.start.toISOString(),
        end: arg.end.toISOString(),
      };
      getEvents(dateRange, selectedDoctor?.id);
    },
    [getEvents, selectedDoctor],
  );

  const handleEventCreated = useCallback(async (newEvent: EventInput) => {
    try {
      await createEvent(newEvent);
      toast({
        title: 'Le rendez-vous a été créé avec succès',
        description: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast({
        title: 'Erreur lors de la création du rendez-vous',
        description: '',
        variant: 'destructive',
      });
    }
  }, []);

  const handleEventUpdated = useCallback(async (updatedEvent: EventInput) => {
    try {
      await updateEvent(updatedEvent);
      toast({
        title: 'Le rendez-vous a été modifié avec succès',
        description: '',
      });
    } catch (error) {
      console.error('Erreur lors du déplacement du rendez-vous:', error);
      toast({
        title: 'Erreur lors de la modification du rendez-vous',
        description: '',
        variant: 'destructive',
      });
    }
  }, []);

  const handleEventClick = (event: any) => {
    const eventData: CalendarEvent = {
      id: event.id,
      title: event.title,
      description: event.extendedProps?.description || '',
      allDay: event.allDay || false,
      // Propriétés de base
      start: event.start,
      end: event.end,
      color: event.backgroundColor,
      // Propriétés de récurrence
      daysOfWeek: event.extendedProps?.daysOfWeek || event.daysOfWeek,
      startRecur: event.extendedProps?.startRecur || event.startRecur,
      endRecur: event.extendedProps?.endRecur || event.endRecur,
      startTime: event.extendedProps?.startTime || event.startTime,
      endTime: event.extendedProps?.endTime || event.endTime,
      // Propriétés personnalisées
      patient: event.extendedProps?.patient,
      practitionerId: event.extendedProps?.practitionerId || user?.id, // Utiliser l'ID de l'utilisateur connecté
      // Propriétés étendues
      type: event.extendedProps?.type || 'appointment',
      status: event.extendedProps?.status,
    };

    setEditingEvent(eventData);
    setIsModalOpen(true);
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventDrop = async (changeInfo: EventChangeArg) => {
    const { event } = changeInfo;

    // Formater les nouvelles dates pour l'affichage
    const newStart = new Date(event.start);
    const newEnd = new Date(event.end);
    const formattedDate = format(newStart, 'eeee dd MMMM yyyy', {
      locale: dateLocale,
    });
    const formattedTime = `${format(newStart, 'HH:mm', {
      locale: dateLocale,
    })} - ${format(newEnd, 'HH:mm', {
      locale: dateLocale,
    })}`;

    // Stocker les informations du déplacement en attente et afficher la popup
    setPendingEventMove({
      event,
      changeInfo,
      formattedDate,
      formattedTime,
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmMove = async () => {
    if (!pendingEventMove) return;

    const { event, changeInfo } = pendingEventMove;
    let newEvent = events.find((e) => e.id === event.id);

    if (newEvent.endTime) {
      // endTime = 'hh:mm'
      newEvent.endTime = new Date(event.end).toTimeString().slice(0, 5);
      newEvent.startTime = new Date(event.start).toTimeString().slice(0, 5);
    } else {
      newEvent.start = event.start;
      newEvent.end = event.end;
    }

    try {
      await updateEvent(newEvent);
      toast({
        title: 'Le rendez-vous a été déplacé avec succès',
        description: '',
      });
    } catch (error) {
      console.error('Erreur lors du déplacement du rendez-vous:', error);
      toast({
        title: 'Erreur lors du déplacement du rendez-vous',
        description: '',
        variant: 'destructive',
      });
    }

    // Fermer la popup et réinitialiser
    setConfirmDialogOpen(false);
    setPendingEventMove(null);
  };

  const handleCancelMove = async () => {
    if (!pendingEventMove) return;

    // Annuler le déplacement en rechargent les événements
    const dateRange = {
      start:
        pendingEventMove.changeInfo.oldEvent.start?.toISOString() ||
        new Date().toISOString(),
      end:
        pendingEventMove.changeInfo.oldEvent.end?.toISOString() ||
        new Date().toISOString(),
    };
    await getEvents(dateRange, selectedDoctor?.id);

    // Fermer la popup et réinitialiser
    setConfirmDialogOpen(false);
    setPendingEventMove(null);
  };

  // Fonction pour formater l'heure
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fonction pour personnaliser le rendu des événements
  const renderEventContent = (eventInfo: any) => {
    const event = eventInfo.event;
    let abort = false;
    let Icon;
    if (event.extendedProps.status === 'waiting') {
      Icon = LucideIcons['Armchair'];
    } else if (event.extendedProps.status === 'consultation') {
      Icon = LucideIcons['Stethoscope'];
    } else if (event.extendedProps.status === 'finished') {
      Icon = LucideIcons['Check'];
    } else if (event.extendedProps.status === 'abortExcused') {
      Icon = LucideIcons['CalendarOff'];
      abort = true;
    } else if (event.extendedProps.status === 'abort') {
      Icon = LucideIcons['Ban'];
      abort = true;
    }

    return (
      <div className="">
        <div className="font-normal whitespace-normal break-words">
          {event.extendedProps?.type === 'absence' ? (
            formatTime(event.start) + ' - ' + event.title
          ) : (
            <>
              <span
                className={`flex items-center gap-2 ${abort ? 'line-through' : ''}`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {formatTime(event.start)} -{' '}
                {isVisible
                  ? event.extendedProps?.patient?.firstname
                  : '******'}{' '}
                {isVisible
                  ? event.extendedProps?.patient?.lastname
                  : '******'}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  const getOpenHours = () => {
    if (!openingHour) return [];

    return openingHour.map((hour) => ({
      daysOfWeek: [hour.dayOfWeek],
      startTime: hour.openTime,
      endTime: hour.closeTime,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16">
        {accessDoctors && accessDoctors.length > 0 && (
          <div className="mx-auto px-4 lg:px-8 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-4 shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Médecin:</Label>
                <Select
                  value={selectedDoctor?.id || ''}
                  onValueChange={(value) => {
                    const doctor = accessDoctors.find((d) => d.id === value);
                    if (doctor) {
                      setSelectedDoctor(doctor);
                      getOpeningHour(doctor.id);
                    }
                  }}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Sélectionner un médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.firstname} {doctor.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>
        )}

        <div className="mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
          >
            {/* Boutons custom pour ScheduleX */}
            <div className="px-3 py-2 mb-4 border rounded-xl bg-card shadow-sm">
              {/* Desktop: horizontal layout */}
              <div className="hidden md:flex items-center justify-between">

                {/* LEFT: navigation */}
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => {
                      const diffInMs = new Date(eventsControl.getRange().end.epochMilliseconds).getTime() - new Date(eventsControl.getRange().start.epochMilliseconds).getTime();
                      const nbDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                      const currentDate = eventsControl.getDate();
                      if (nbDays > 7) {
                        const previousDate = currentDate.subtract({ months: 1 });
                        eventsControl.setDate(previousDate);
                      } else {
                        const previousDate = currentDate.subtract({ days: nbDays });
                        eventsControl.setDate(previousDate);
                      }
                    }}
                  >
                    ◀
                  </button>

                  <button
                    className="px-3 py-1 rounded-md border hover:bg-muted text-sm font-medium"
                    onClick={() => {
                      const today = Temporal.Now.plainDateISO();
                      eventsControl.setDate(today);
                    }}
                  >
                    Aujourd'hui
                  </button>

                  <button className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => {
                      const diffInMs = new Date(eventsControl.getRange().end.epochMilliseconds).getTime() - new Date(eventsControl.getRange().start.epochMilliseconds).getTime();
                      const nbDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                      const currentDate = eventsControl.getDate();
                      if (nbDays > 7) {
                        const previousDate = currentDate.add({ months: 1 });
                        eventsControl.setDate(previousDate);
                      } else {
                        const previousDate = currentDate.add({ days: nbDays });
                        eventsControl.setDate(previousDate);
                      }
                    }}>
                    ▶
                  </button>
                </div>

                {/* CENTER: title (like Google Calendar) */}
                <div className="text-sm font-semibold text-muted-foreground">
                  {calendarTitle}
                </div>

                {/* RIGHT: views + actions */}
                <div className="flex items-center gap-2">

                  <div className="flex border rounded-lg overflow-hidden text-sm">
                    <button
                      className="px-3 py-1 hover:bg-muted"
                      onClick={() => eventsControl.setView('day')}
                    >
                      Jour
                    </button>
                    <button
                      className="px-3 py-1 hover:bg-muted border-x"
                      onClick={() => eventsControl.setView('week')}
                    >
                      Semaine
                    </button>
                    <button
                      className="px-3 py-1 hover:bg-muted"
                      onClick={() => eventsControl.setView('month-grid')}
                    >
                      Mois
                    </button>
                  </div>

                  {/* divider */}
                  <div className="w-px h-6 bg-border mx-1" />

                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => setIsVisible(v => !v)}
                    title="Masquer / afficher les patients"
                  >
                    {isVisible ?
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M1 1l22 22" />
                      </svg>
                      :
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    }
                  </button>
                </div>
              </div>
              {/* visibility */}
              <div className="md:hidden flex flex-col items-center space-y-3">

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => {
                      const diffInMs = new Date(eventsControl.getRange().end.epochMilliseconds).getTime() - new Date(eventsControl.getRange().start.epochMilliseconds).getTime();
                      const nbDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                      const currentDate = eventsControl.getDate();
                      if (nbDays > 7) {
                        const previousDate = currentDate.subtract({ months: 1 });
                        eventsControl.setDate(previousDate);
                      } else {
                        const previousDate = currentDate.subtract({ days: nbDays });
                        eventsControl.setDate(previousDate);
                      }
                    }}
                  >
                    ◀
                  </button>

                  <button
                    className="px-3 py-1 rounded-md border hover:bg-muted text-sm font-medium"
                    onClick={() => {
                      const today = Temporal.Now.plainDateISO();
                      eventsControl.setDate(today);
                    }}
                  >
                    Aujourd'hui
                  </button>

                  <button className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => {
                      const diffInMs = new Date(eventsControl.getRange().end.epochMilliseconds).getTime() - new Date(eventsControl.getRange().start.epochMilliseconds).getTime();
                      const nbDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                      const currentDate = eventsControl.getDate();
                      if (nbDays > 7) {
                        const previousDate = currentDate.add({ months: 1 });
                        eventsControl.setDate(previousDate);
                      } else {
                        const previousDate = currentDate.add({ days: nbDays });
                        eventsControl.setDate(previousDate);
                      }
                    }}>
                    ▶
                  </button>
                </div>

                {/* Title */}
                <div className="text-sm font-semibold text-muted-foreground text-center">
                  {calendarTitle}
                </div>

                {/* Views and actions */}
                <div className="flex flex-col items-center space-y-2">

                  <div className="flex border rounded-lg overflow-hidden text-sm">
                    <button
                      className="px-3 py-1 hover:bg-muted"
                      onClick={() => eventsControl.setView('day')}
                    >
                      Jour
                    </button>
                    <button
                      className="px-3 py-1 hover:bg-muted border-x"
                      onClick={() => eventsControl.setView('week')}
                    >
                      Semaine
                    </button>
                    <button
                      className="px-3 py-1 hover:bg-muted"
                      onClick={() => eventsControl.setView('month-grid')}
                    >
                      Mois
                    </button>
                  </div>

                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => setIsVisible(v => !v)}
                    title="Masquer / afficher les patients"
                  >
                    {isVisible ?
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M1 1l22 22" />
                      </svg>
                      :
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    }
                  </button>
                </div>
              </div>
            </div>

            <ScheduleXCalendar calendarApp={calendar} />
            {/* <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right:
                  window.innerWidth < 768
                    ? 'toggleVisibility timeGridDay,listWeek'
                    : 'toggleVisibility dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              customButtons={{
                toggleVisibility: {
                  text: '',
                  click: () => {
                    setIsVisible((prev) => !prev);
                  },
                },
              }}
              views={{
                dayGridMonth: {
                  dayMaxEventRows: 4,
                },
                timeGridWeek: {
                  dayMaxEventRows: 6,
                },
                timeGridDay: {
                  dayMaxEventRows: 6,
                },
              }}
              titleFormat={(arg) => {
                // get number of days diff into start and end
                const diff = Math.abs(
                  new Date(arg.end.marker).getTime() -
                  new Date(arg.start.marker).getTime(),
                );
                let nbdays = Math.round(diff / (1000 * 60 * 60 * 24));

                if (nbdays === 7) {
                  return (
                    format(arg.start.marker, 'dd MMMM', {
                      locale: dateLocale,
                    }) +
                    ' - ' +
                    format(arg.end.marker, 'dd MMMM yyyy', {
                      locale: dateLocale,
                    })
                  );
                } else if (nbdays > 7) {
                  return format(arg.start.marker, 'MMMM yyyy', {
                    locale: dateLocale,
                  });
                }
                return format(arg.end.marker, 'dd MMMM yyyy', {
                  locale: dateLocale,
                });
              }}
              dayHeaderContent={(arg) => {
                if (arg.view.type === 'timeGridDay') {
                  return format(arg.date, 'eeee', {
                    locale: dateLocale,
                  });
                } else if (arg.view.type === 'listWeek') {
                  return format(arg.date, 'eeee dd MMMM', {
                    locale: dateLocale,
                  });
                } else if (arg.view.type === 'timeGridWeek') {
                  return format(arg.date, 'eee dd/MM', {
                    locale: dateLocale,
                  });
                } else if (arg.view.type === 'dayGridMonth') {
                  return format(arg.date, 'eee', {
                    locale: dateLocale,
                  });
                } else {
                  return;
                }
              }}
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                meridiem: false,
              }}
              locales={allLocales}
              locale={localeMap[language] || 'en'}
              key={'sq'}
              dateClick={handleDateClick}
              events={events}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              allDaySlot={false}
              height="auto"
              handleWindowResize={true}
              nowIndicator={true}
              datesSet={handleDatesSet}
              initialView={
                window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'
              }
              windowResize={(view) => {
                const calendar = view.view.calendar;
                if (!calendar) return;

                const isMobile = window.innerWidth < 768;

                calendar.setOption('headerToolbar', {
                  left: 'prev,next today',
                  center: 'title',
                  right: isMobile
                    ? 'timeGridDay,listWeek'
                    : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                });

                if (isMobile && view.view.type === 'dayGridMonth') {
                  calendar.changeView('timeGridDay');
                } else if (!isMobile && view.view.type === 'timeGridDay') {
                  calendar.changeView('timeGridWeek');
                }
              }}
              businessHours={getOpenHours()}
              firstDay={1}
              slotMinTime={slotMinTime}
              slotMaxTime={slotMaxTime}
              slotDuration="00:15:00"
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                omitZeroMinute: true,
              }}
              slotLabelInterval="01:00"
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              eventContent={renderEventContent}
              eventDataTransform={(event) => {
                // S'assurer que les propriétés personnalisées sont bien transmises
                return {
                  ...event,
                  extendedProps: {
                    ...event.extendedProps,
                    // Si daysOfWeek est défini au niveau racine, le déplacer dans extendedProps
                    daysOfWeek:
                      event.daysOfWeek || event.extendedProps?.daysOfWeek,
                    // Faire de même pour les autres propriétés de récurrence
                    startRecur:
                      event.startRecur || event.extendedProps?.startRecur,
                    endRecur: event.endRecur || event.extendedProps?.endRecur,
                    startTime:
                      event.startTime || event.extendedProps?.startTime,
                    endTime: event.endTime || event.extendedProps?.endTime,
                  },
                };
              }}
            /> */}
          </motion.div>
        </div>
      </main>
      <CreateAppointmentModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEvent(null);
          }
          setIsModalOpen(open);
        }}
        initialDate={selectedDate || new Date()}
        eventToEdit={editingEvent || undefined}
        selectedDoctor={selectedDoctor}
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
      />

      {/* Dialog de confirmation pour déplacement de rendez-vous */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.agenda.mooveTitle}</DialogTitle>
            <DialogDescription>
              {t.agenda.mooveDescription}
            </DialogDescription>
          </DialogHeader>
          {pendingEventMove && (
            <div className="py-4">
              <p className="text-sm font-medium">{t.agenda.mooveSlot} :</p>
              <p className="text-sm text-gray-600 mt-1">
                {pendingEventMove.formattedDate}
              </p>
              <p className="text-sm text-gray-600">
                {pendingEventMove.formattedTime}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelMove}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleConfirmMove}>{t.common.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
