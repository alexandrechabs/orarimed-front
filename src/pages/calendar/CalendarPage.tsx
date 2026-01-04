import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const { t, language } = useLanguage();
  const [events] = useState([
    {
      id: '1',
      title: 'Konsultë Kardiologjike',
      start: new Date().toISOString().split('T')[0] + 'T10:00:00',
      end: new Date().toISOString().split('T')[0] + 'T10:30:00',
      backgroundColor: 'hsl(var(--primary))',
      borderColor: 'hsl(var(--primary))',
    },
    {
      id: '2',
      title: 'Kontroll Pediatrik',
      start:
        new Date(Date.now() + 86400000).toISOString().split('T')[0] +
        'T14:00:00',
      end:
        new Date(Date.now() + 86400000).toISOString().split('T')[0] +
        'T14:30:00',
      backgroundColor: 'hsl(var(--accent))',
      borderColor: 'hsl(var(--accent))',
    },
    {
      id: '3',
      title: 'Analiza Gjaku',
      start:
        new Date(Date.now() + 172800000).toISOString().split('T')[0] +
        'T09:00:00',
      end:
        new Date(Date.now() + 172800000).toISOString().split('T')[0] +
        'T09:15:00',
      backgroundColor: 'hsl(var(--secondary))',
      borderColor: 'hsl(var(--secondary-foreground))',
    },
  ]);

  const localeMap: Record<string, string> = {
    sq: 'sq',
    en: 'en',
    fr: 'fr',
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
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
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                list: 'Liste',
              }}
              themeSystem="standard"
              allDayText=""
              locale={localeMap[language] || 'en'}
              events={events}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              height="auto"
              nowIndicator={true}
              businessHours={[
                {
                  daysOfWeek: [1, 2, 3], // Monday, Tuesday, Wednesday
                  startTime: '08:00', // 8am
                  endTime: '18:00', // 6pm
                },
                {
                  daysOfWeek: [4, 5], // Thursday, Friday
                  startTime: '10:00', // 10am
                  endTime: '20:00', // 4pm
                },
              ]}
              slotMinTime={'07:00:00'}
              slotMaxTime={'21:00:00'}
              eventClick={(info) => {
                alert(`details: ${info.event.title}`);
              }}
              dateClick={(info) => {
                alert(`selected: ${info.dateStr}`);
              }}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
