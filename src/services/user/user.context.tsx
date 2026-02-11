import { createContext, useState, useCallback } from 'react';
import { userService } from './user.service';
import { Patient } from '../../types/patient';
import { EventInput } from '@fullcalendar/core/index.js';
import { DateRange } from '../../types/date';
import { User } from '@/types/user';
import { DoctorProfile } from '@/types/doctor';
import { OpeningHour } from '@/types/openingHour';
import { ConsultationReason } from '@/types/consultationReason';

type UserContextType = {
  events: EventInput[];
  isLoading: boolean;
  openingHour: OpeningHour[] | null;
  searchPatient: (
    firstName: string,
    lastName: string,
    birthDate: string,
  ) => Promise<Patient | null>;
  getPatient: (id: string) => Promise<Patient | null>;
  getDoctor: (doctorIdentifier: string) => Promise<DoctorProfile | null>;
  searchDoctors: (
    address: string,
    lat: string,
    lng: string,
    locale: string,
    q: string,
  ) => Promise<any[]>;
  getUsersAdmin: (role: number) => Promise<any[]>;
  searchDoctorAutocomplete: (query: string, locale: string) => Promise<any>;
  getAvailableSlots: (doctorId: string, date: string) => Promise<any[]>;
  getEvents: (dateRange?: DateRange) => Promise<EventInput[]>;
  createEvent: (event: EventInput) => Promise<EventInput>;
  updateEvent: (event: EventInput) => Promise<EventInput>;
  createUser: (userData: {
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    country: string;
    coordinate: {
      x: number;
      y: number;
    };
    phoneNumber: string;
    password: string;
    roleId: number;
    visible: boolean;
    specialityId: number;
    acceptTerms: boolean;
  }) => Promise<User>;
  updateUser: (
    id: string,
    userData: {
      email: string;
      firstname: string;
      lastname: string;
      address: string;
      city: string;
      country: string;
      coordinate: {
        x: number;
        y: number;
      };
      phoneNumber: string;
      password?: string;
      roleId: number;
      visible: boolean;
      active: boolean;
      specialityId: number;
    },
  ) => Promise<User>;
  saveSubSpecialities: (id: string, subSpecialityId: number[]) => Promise<void>;
  getOpeningHours: (id: string) => Promise<OpeningHour[]>;
  saveOpeningHours: (
    id: string,
    openingHours: OpeningHour[],
  ) => Promise<OpeningHour[]>;
  getReasons: (id: string) => Promise<ConsultationReason[]>;
  saveReasons: (
    id: string,
    reasons: ConsultationReason[],
  ) => Promise<ConsultationReason[]>;
  searchClient: (search: string) => Promise<any[]>;
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openingHour, setOpeningHour] = useState<OpeningHour[] | null>(null);

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

  async function searchDoctors(
    address: string,
    lat: string,
    lng: string,
    locale: string,
    q: string,
  ): Promise<any[]> {
    const data = await userService.searchDoctors(address, lat, lng, locale, q);
    return data;
  }

  async function getUsersAdmin(role: number): Promise<any[]> {
    const data = await userService.getUsersAdmin(role);
    return data;
  }

  async function searchDoctorAutocomplete(
    query: string,
    locale: string,
  ): Promise<any[]> {
    const data = await userService.searchDoctorAutocomplete(query, locale);
    return data;
  }

  async function getAvailableSlots(
    doctorId: string,
    date: string,
  ): Promise<any[]> {
    const data = await userService.getAvailableSlots(doctorId, date);
    return data;
  }

  async function createUser(
    userData: Parameters<UserContextType['createUser']>[0],
  ) {
    const data = await userService.createUser(userData);
    return data;
  }

  async function updateUser(
    id: string,
    userData: Parameters<UserContextType['updateUser']>[1],
  ) {
    const data = await userService.updateUser(id, userData);
    return data;
  }

  async function saveSubSpecialities(id: string, subSpecialityId: number[]) {
    const data = userService.saveSubSpecialities(id, subSpecialityId);
    return;
  }

  async function getOpeningHours(id) {
    const data = await userService.getOpeningHours(id);
    setOpeningHour(data);
    return data;
  }

  async function saveOpeningHours(id: string, openingHours: OpeningHour[]) {
    const data = await userService.saveOpeningHours(id, openingHours);
    setOpeningHour(data);
    return data;
  }

  async function getReasons(id) {
    const data = await userService.getReasons(id);
    return data;
  }

  async function saveReasons(id, reasons: ConsultationReason[]) {
    const data = await userService.saveReasons(id, reasons);
    return data;
  }

  async function searchClient(search: string) {
    const data = await userService.searchClient(search);
    return data;
  }

  return (
    <UserContext.Provider
      value={{
        events,
        openingHour,
        isLoading,
        searchPatient,
        getPatient,
        getEvents,
        createEvent,
        updateEvent,
        getDoctor,
        getUsersAdmin,
        searchDoctors,
        searchDoctorAutocomplete,
        getAvailableSlots,
        createUser,
        updateUser,
        saveSubSpecialities,
        getOpeningHours,
        saveOpeningHours,
        getReasons,
        saveReasons,
        searchClient,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
