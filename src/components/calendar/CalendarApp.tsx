import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
    createViewDay,
    createViewWeekAgenda,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function CalendarApp() {
    const eventsService = useState(() => createEventsServicePlugin())[0]
    const { t, language } = useLanguage();

    const localeMap: Record<string, string> = {
        sq: 'sq-AL',
        en: 'en-US',
        fr: 'fr-FR',
    };

    const calendar = useCalendarApp({
        locale: localeMap[language] || 'en',
        views: [createViewDay(), createViewWeekAgenda(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events: [
            {
                id: '1',
                title: 'Event 1',
                start: Temporal.PlainDate.from('2026-05-08'),
                end: Temporal.PlainDate.from('2026-05-08'),
            },
            {
                id: '2',
                title: 'Event 2',
                start: Temporal.ZonedDateTime.from('2026-05-08T10:15:00+02:00[Europe/Paris]'),
                end: Temporal.ZonedDateTime.from('2026-05-08T10:30:00+02:00[Europe/Paris]'),
            }
        ],
        dayBoundaries: {
            start: '06:00',
            end: '18:00',
        },
        weekOptions: {
            gridStep: 15,
        },
        plugins: [eventsService],
        callbacks: {
            onEventClick(calendarEvent, e: UIEvent) {
            },
        },
    })

    useEffect(() => {
        // get all events
        eventsService.getAll()
    }, [])

    return (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    )
}

export default CalendarApp