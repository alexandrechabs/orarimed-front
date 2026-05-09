import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeekAgenda,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
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
  const [isVisible, setIsVisible] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

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
          title: event.title,
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

  const getOpeningHour = async (doctorId?: string) => {
    getOpeningHours(doctorId || selectedDoctor?.id || user?.id).then(
      (hours) => {
        if (!hours || hours.length === 0) return;

        const minTime = hours.reduce((min, hour) => {
          return hour.openTime < min ? hour.openTime : min;
        }, hours[0].openTime);
        const maxTime = hours.reduce((max, hour) => {
          return hour.closeTime > max ? hour.closeTime : max;
        }, hours[0].closeTime);

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

  const handleEventClick = (info: any) => {
    const event = info.event;

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

    if (newEvent) {
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
          description: `Nouveau créneau : ${pendingEventMove.formattedDate} de ${pendingEventMove.formattedTime}`,
        });
      } catch (error) {
        console.error('Erreur lors du déplacement du rendez-vous:', error);
        toast({
          title: 'Erreur lors du déplacement du rendez-vous',
          description: '',
          variant: 'destructive',
        });
      }
    }

    // Fermer la popup et réinitialiser
    setConfirmDialogOpen(false);
    setPendingEventMove(null);
  };

  const handleCancelMove = async () => {
    if (!pendingEventMove) return;

    // Annuler le déplacement en rechargeant les événements
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
            <div className="px-3 py-2 border rounded-xl bg-card shadow-sm">
              {/* Desktop: horizontal layout */}
              <div className="hidden md:flex items-center justify-between">
                
                {/* LEFT: navigation */}
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => {
                      const currentDate = eventsControl.getDate();
                      const previousDate = currentDate.subtract({ days: 1 });
                      eventsControl.setDate(previousDate);
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

                  <button className="px-2 py-1 rounded hover:bg-muted">
                    ▶
                  </button>
                </div>

                {/* CENTER: title (like Google Calendar) */}
                <div className="text-sm font-semibold text-muted-foreground">
                  {currentDate
                    ? format(currentDate, 'EEEE dd MMMM yyyy', { locale: localeMap[language].split('-')[0] as any })
                    : 'Calendrier'}
                </div>

                {/* RIGHT: views + actions */}
                <div className="flex items-center gap-2">

                  {/* view switch (dropdown menu) */}
                  <div className="relative">
                    <button
                      className="px-3 py-1 rounded-md border hover:bg-muted text-sm flex items-center gap-2"
                      onClick={() => {
                        const dropdown = document.getElementById('view-dropdown');
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                    >
                      <span id="current-view-text">Vue</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div 
                      id="view-dropdown"
                      className="absolute right-0 mt-1 w-40 bg-white border border-border rounded-md shadow-lg z-50 hidden"
                    >
                      <div className="py-1">
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('day');
                            document.getElementById('view-dropdown')?.classList.add('hidden');
                            document.getElementById('current-view-text')!.textContent = 'Jour';
                          }}
                        >
                          <span className="w-2">📅</span>
                          Jour
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('week');
                            document.getElementById('view-dropdown')?.classList.add('hidden');
                            document.getElementById('current-view-text')!.textContent = 'Semaine';
                          }}
                        >
                          <span className="w-2">📆</span>
                          Semaine
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('month-grid');
                            document.getElementById('view-dropdown')?.classList.add('hidden');
                            document.getElementById('current-view-text')!.textContent = 'Mois';
                          }}
                        >
                          <span className="w-2">🗓️</span>
                          Mois
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('month-agenda');
                            document.getElementById('view-dropdown')?.classList.add('hidden');
                            document.getElementById('current-view-text')!.textContent = 'Agenda';
                          }}
                        >
                          <span className="w-2">📋</span>
                          Agenda
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('week-agenda');
                            document.getElementById('view-dropdown')?.classList.add('hidden');
                            document.getElementById('current-view-text')!.textContent = 'Semaine Agenda';
                          }}
                        >
                          <span className="w-2">📅</span>
                          Semaine Agenda
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div className="w-px h-6 bg-border mx-1" />

                  {/* visibility */}
                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => setIsVisible(v => !v)}
                    title="Masquer / afficher les patients"
                  >
                    {isVisible ? '👁' : '👁‍🗨'}
                  </button>
                </div>
              </div>

              {/* Mobile: vertical layout */}
              <div className="md:hidden flex flex-col items-center space-y-3">
                
                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded hover:bg-muted"
                    onClick={() => {
                      const currentDate = eventsControl.getDate();
                      const previousDate = currentDate.subtract({ days: 1 });
                      eventsControl.setDate(previousDate);
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

                  <button className="px-2 py-1 rounded hover:bg-muted">
                    ▶
                  </button>
                </div>

                {/* Title */}
                <div className="text-sm font-semibold text-muted-foreground text-center">
                  {currentDate
                    ? format(currentDate, 'EEEE dd MMMM yyyy', { locale: localeMap[language].split('-')[0] as any })
                    : 'Calendrier'}
                </div>

                {/* Views and actions */}
                <div className="flex flex-col items-center space-y-2">
                  
                  {/* view switch (dropdown menu) */}
                  <div className="relative">
                    <button
                      className="px-3 py-1 rounded-md border hover:bg-muted text-sm flex items-center gap-2"
                      onClick={() => {
                        const dropdown = document.getElementById('mobile-view-dropdown');
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                    >
                      <span>Vues</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div 
                      id="mobile-view-dropdown"
                      className="absolute right-0 mt-1 w-40 bg-white border border-border rounded-md shadow-lg z-50 hidden"
                    >
                      <div className="py-1">
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('day');
                            document.getElementById('mobile-view-dropdown')?.classList.add('hidden');
                          }}
                        >
                          <span className="w-2">📅</span>
                          Jour
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('week');
                            document.getElementById('mobile-view-dropdown')?.classList.add('hidden');
                          }}
                        >
                          <span className="w-2">📆</span>
                          Semaine
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('month-grid');
                            document.getElementById('mobile-view-dropdown')?.classList.add('hidden');
                          }}
                        >
                          <span className="w-2">🗓️</span>
                          Mois
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('month-agenda');
                            document.getElementById('mobile-view-dropdown')?.classList.add('hidden');
                          }}
                        >
                          <span className="w-2">📋</span>
                          Agenda
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            eventsControl.setView('week-agenda');
                            document.getElementById('mobile-view-dropdown')?.classList.add('hidden');
                          }}
                        >
                          <span className="w-2">📅</span>
                          Semaine Agenda
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ScheduleXCalendar calendarApp={calendar} />
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
