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
  status?: string;
}
