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
import { EventInput } from '@fullcalendar/core/index.js';
import CreateAppointmentModal from '@/components/calendar/CreateAppointmentModal';
import { useUser } from '@/services/user/useUser';

const CalendarPage = () => {
  const { openingHour, getOpeningHours } = useAuth();
  const { events, createEvent, getEvents, updateEvent } = useUser();
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventInput | null>(null);

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
    getOpeningHours();
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
      console.log(dateRange);
      getEvents(dateRange);
    },
    [getEvents]
  );

  const handleEventCreated = useCallback((newEvent: EventInput) => {
    createEvent(newEvent);
  }, []);

  const handleEventUpdated = useCallback((updatedEvent: EventInput) => {
    updateEvent(updatedEvent);
  }, []);

  const handleEventClick = (info: any) => {
    const event = info.event;
    const extendedProps = event.extendedProps || {};

    const eventData: EventInput = {
      id: event.id,
      title: event.title,
      description: event.extendedProps?.description || '',
      allDay: event.allDay || false,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      // Extraire les propriétés de récurrence
      daysOfWeek:
        event.extendedProps?.daysOfWeek ||
        event.extendedProps?.recurringDays ||
        event.daysOfWeek,
      startRecur: event.extendedProps?.startRecur || event.startRecur,
      endRecur: event.extendedProps?.endRecur || event.endRecur,
      startTime: event.extendedProps?.startTime || event.startTime,
      endTime: event.extendedProps?.endTime || event.endTime,
      // Pour la compatibilité avec les événements non récurrents
      start: event.start,
      end: event.end,
      patientId: event.extendedProps?.patientId,
      doctorId: event.extendedProps?.doctorId,
    };

    setEditingEvent(eventData);
    setIsModalOpen(true);
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date);
    setEditingEvent(null);
    setIsModalOpen(true);
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
    const isRecurring =
      event.extendedProps.daysOfWeek || event.extendedProps.startRecur;

    return (
      <div className="p-1">
        <div className="font-medium truncate">{event.title}</div>
        {!isRecurring && (
          <div className="text-xs opacity-75">
            {formatTime(event.start)} - {formatTime(event.end)}
          </div>
        )}
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
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-between"
          >
            <h1 className="text-2xl font-bold tracking-tight">Calendrier</h1>
            <Button
              variant="hero"
              onClick={() => {
                setSelectedDate(new Date());
                setEditingEvent(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un rendez-vous
            </Button>
          </motion.div>
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
              allDaySlot={true}
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
              slotMinTime={'04:00:00'}
              slotMaxTime={'21:00:00'}
              eventClick={handleEventClick}
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
        eventToEdit={editingEvent}
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default CalendarPage;
