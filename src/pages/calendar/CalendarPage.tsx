import { useState, useCallback, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { useAuth } from '@/services/auth/useAuth';
import { EventChangeArg, EventInput } from '@fullcalendar/core/index.js';
import CreateAppointmentModal from '@/components/calendar/CreateAppointmentModal';
import { useUser } from '@/services/user/useUser';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/types/CalendarEvent';
import * as LucideIcons from 'lucide-react';

const CalendarPage = () => {
  const { user } = useAuth();
  const {
    events,
    createEvent,
    getEvents,
    updateEvent,
    openingHour,
    getOpeningHours,
  } = useUser();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [slotMinTime, setSlotMinTime] = useState('08:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('21:00:00');
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    getOpeningHours(user.id).then((hours) => {
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
        getEvents(dateRange);
      }
    }, 60 * 1000); // 1 minute

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'au montage/démontage

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
    [getEvents],
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
    let abort = false;
    let Icon;
    if (event.extendedProps.status === 'waiting') {
      Icon = LucideIcons['Armchair'];
    } else if (event.extendedProps.status === 'consultation') {
      Icon = LucideIcons['Stethoscope'];
    } else if (event.extendedProps.status === 'finished') {
      Icon = LucideIcons['Check'];
    } else if (event.extendedProps.status === 'abort excused') {
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
                {event.extendedProps?.patient?.firstname}{' '}
                {event.extendedProps?.patient?.lastname}
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
      <main className="pt-4 pb-16">
        <div className="mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
          >
            <FullCalendar
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
