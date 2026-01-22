import { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/services/auth/useAuth';
import { EventChangeArg, EventInput } from '@fullcalendar/core/index.js';
import CreateAppointmentModal, {
  CalendarEvent,
} from '@/components/calendar/CreateAppointmentModal';
import { useUser } from '@/services/user/useUser';
import { time } from 'console';
import { useToast } from '@/hooks/use-toast';

const CalendarPage = () => {
  const { openingHour, getOpeningHours, user } = useAuth();
  const { events, createEvent, getEvents, updateEvent } = useUser();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [slotMinTime, setSlotMinTime] = useState('08:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('21:00:00');

  const [oldEvents, setEvents] = useState<EventInput[]>([
    // Exemple d'événement unique
    {
      allDay: false,
      backgroundColor: '#ff0000',
      borderColor: '#ff0000',
      daysOfWeek: [2],
      description: 'a',
      endRecur: '2026-01-30',
      endTime: '11:00',
      id: 'event-1768045414266',
      startRecur: '2026-01-06',
      startTime: '10:30',
      title: 'Contrôle',
      patientId: '4067a2e8-af64-48e8-83cb-23fe3ad70519',
    },
    {
      allDay: false,
      backgroundColor: 'hsl(var(--primary))',
      description: 'dd',
      end: '2026-01-06T09:00:00.000Z',
      id: 'event-1768045391349',
      start: '2026-01-06T08:30:00.000Z',
      title: 'Consultation',
      patientId: '4067a2e8-af64-48e8-83cb-23fe3ad70519',
    },
    {
      allDay: true,
      backgroundColor: '#F59E0B',
      borderColor: '#F59E0B',
      daysOfWeek: [1, 2, 3, 4, 5],
      description: 'eee',
      endRecur: '2026-01-16',
      id: 'event-1768138056405',
      startRecur: '2026-01-13',
      title: 'Contrôle',
      patientId: '4067a2e8-af64-48e8-83cb-23fe3ad70519',
    },
  ]);

  useEffect(() => {
    getOpeningHours().then((hours) => {
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
          .padStart(2, '0')}:00`;
      };

      setSlotMinTime(formatTimeForCalendar(minTime, -1));
      setSlotMaxTime(formatTimeForCalendar(maxTime, 1));
    });
  }, []);

  const localeMap: Record<string, string> = {
    sq: 'sq',
    en: 'en',
    fr: 'fr',
  };

  const handleDatesSet = useCallback(
    (arg: { start: Date; end: Date }) => {
      const dateRange = {
        start: arg.start.toISOString(),
        end: arg.end.toISOString(),
      };
      getEvents(dateRange);
    },
    [getEvents]
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
      color: event.extendedProps?.color,
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
      eventKind: event.extendedProps?.eventKind || 'appointment',
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

    return (
      <div className="">
        <div className="font-normal truncate">
          {formatTime(event.start)} - {event.extendedProps?.patient?.firstname}{' '}
          {event.extendedProps?.patient?.lastname}
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
      <main className="pt-4 pb-16">
        <div className="mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
          >
            <FullCalendar
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
                    ? 'timeGridDay,listWeek'
                    : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' },
                  dayMaxEventRows: 4,
                },
                timeGridWeek: {
                  titleFormat: {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                  dayMaxEventRows: 6,
                },
                timeGridDay: {
                  titleFormat: {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                  dayMaxEventRows: 6,
                },
              }}
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                list: 'Liste',
              }}
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                meridiem: false,
              }}
              locale={localeMap[language] || 'en'}
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
            />
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
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default CalendarPage;
