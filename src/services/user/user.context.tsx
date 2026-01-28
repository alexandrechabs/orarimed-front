import { createContext, useState, useCallback } from 'react';
import { userService } from './user.service';
import { Patient } from '../../types/patient';
import { EventInput } from '@fullcalendar/core/index.js';
import { DateRange } from '../../types/date';
import { User } from '@/types/user';
import { DoctorProfile } from '@/types/doctor';

type UserContextType = {
  events: EventInput[];
  isLoading: boolean;
  searchPatient: (
    firstName: string,
    lastName: string,
    birthDate: string,
  ) => Promise<Patient | null>;
  getPatient: (id: string) => Promise<Patient | null>;
  getDoctor: (doctorIdentifier: string) => Promise<DoctorProfile | null>;
  searchDoctors: (query: string, locale: string) => Promise<any[]>;
  searchDoctorAutocomplete: (query: string, locale: string) => Promise<any>;
  getEvents: (dateRange?: DateRange) => Promise<EventInput[]>;
  createEvent: (event: EventInput) => Promise<EventInput>;
  updateEvent: (event: EventInput) => Promise<EventInput>;
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function searchPatient(
    firstName: string,
    lastName: string,
    birthDate: string,
  ): Promise<Patient | null> {
    const data = await userService.searchPatient(
      firstName,
      lastName,
      birthDate,
    );
    return data;
  }

  async function getPatient(id: string): Promise<Patient | null> {
    const data = await userService.getPatient(id);
    return data;
  }

  const getEvents = useCallback(
    async (dateRange?: DateRange): Promise<EventInput[]> => {
      setLoading(true);
      try {
        const data: EventInput[] = await userService.getEvents(dateRange);
        if (dateRange) {
          // Si on a une plage de dates spécifique, on remplace les événements
          setEvents(data);
        } else {
          // Sinon on ajoute les événements à la liste existante
          setEvents((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const newEvents = data.filter(
              (event) => !existingIds.has(event.id),
            );
            return [...prev, ...newEvents];
          });
        }
        return data;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  async function createEvent(event: EventInput): Promise<EventInput> {
    const data = await userService.createEvent(event);
    setEvents((prev) => [
      ...prev.filter((e) => e.id !== data.id),
      {
        ...data,
      },
    ]);
    return;
  }

  async function updateEvent(event: EventInput): Promise<EventInput> {
    const data = await userService.updateEvent(event);
    setEvents((prev) => [
      ...prev.filter((e) => e.id !== data.id),
      {
        ...data,
      },
    ]);
    return;
  }

  async function getDoctor(
    doctorIdentifier: string,
  ): Promise<DoctorProfile | null> {
    const data = await userService.getDoctor(doctorIdentifier);
    return data;
  }

  async function searchDoctors(query: string, locale: string): Promise<any[]> {
    const data = await userService.searchDoctors(query, locale);
    return data;
  }

  async function searchDoctorAutocomplete(
    query: string,
    locale: string,
  ): Promise<any[]> {
    const data = await userService.searchDoctorAutocomplete(query, locale);
    return data;
  }

  return (
    <UserContext.Provider
      value={{
        events,
        isLoading,
        searchPatient,
        getPatient,
        getEvents,
        createEvent,
        updateEvent,
        getDoctor,
        searchDoctors,
        searchDoctorAutocomplete,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
