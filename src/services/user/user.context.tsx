import { createContext, useState, useCallback } from 'react';
import { userService } from './user.service';
import { Patient } from '../../types/patient';
import { EventInput } from '@fullcalendar/core/index.js';
import { DateRange } from '../../types/date';
import { User } from '@/types/user';
import { DoctorProfile } from '@/types/doctor';
import { OpeningHour } from '@/types/openingHour';
import { ConsultationReason } from '@/types/consultationReason';
import { Center } from '@/types/center';

type UserContextType = {
  events: EventInput[];
  isLoading: boolean;
  openingHour: OpeningHour[];
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
  getUsersAdmin: (role: number, q?: string) => Promise<any[]>;
  searchDoctorAutocomplete: (query: string, locale: string) => Promise<any>;
  getAvailableSlots: (
    doctorId: string,
    date: string,
    duration?: number,
    numberOfDays?: number,
  ) => Promise<any[]>;
  getEvents: (dateRange?: DateRange, userId?: string) => Promise<EventInput[]>;
  createEvent: (event: EventInput) => Promise<EventInput>;
  updateEvent: (event: EventInput) => Promise<EventInput>;
  createUser: (userData: {
    email: string;
    firstname: string;
    lastname: string;
    address?: string;
    city?: string;
    country?: string;
    coordinate?: {
      x: number;
      y: number;
    };
    phoneNumber: string;
    password: string;
    roleId: number;
    visible?: boolean;
    specialityId?: number;
    acceptTerms: boolean;
  }) => Promise<User>;
  updateUser: (
    id: string,
    userData: {
      email: string;
      firstname: string;
      lastname: string;
      address?: string;
      city?: string;
      country?: string;
      coordinate?: {
        x: number;
        y: number;
      };
      phoneNumber: string;
      password?: string;
      roleId: number;
      visible?: boolean;
      active: boolean;
      specialityId?: number;
    },
  ) => Promise<User>;
  saveSubSpecialities: (id: string, subSpecialityId: number[]) => Promise<void>;
  getOpeningHours: (id: string) => Promise<OpeningHour[]>;
  saveOpeningHours: (
    id: string,
    openingHours: OpeningHour[],
  ) => Promise<OpeningHour[]>;
  getOpeningHoursCenter: (id: string) => Promise<OpeningHour[]>;
  saveOpeningHoursCenter: (
    id: string,
    openingHours: OpeningHour[],
  ) => Promise<OpeningHour[]>;
  getReasonsClient: (id: string) => Promise<ConsultationReason[]>;
  getReasons: (id: string) => Promise<ConsultationReason[]>;
  saveReasons: (
    id: string,
    reasons: ConsultationReason[],
  ) => Promise<ConsultationReason[]>;
  searchClient: (search: string, userId?: string) => Promise<any[]>;
  checkValidSelection: (
    id: string,
    reasonId: number,
    slot: string,
  ) => Promise<{ valid: boolean }>;
  createRdv: (
    doctorId: string,
    slot: string,
    reasonId: number,
  ) => Promise<void>;
  getRdvHistoryDoctor: (id: number) => Promise<any[]>;
  getRdvNotificationsDoctor: (eventId: string) => Promise<any[]>;
  createCenter: (centerData: Center) => Promise<Center>;
  getCenters: () => Promise<Center[]>;
  getCenter: (id: string) => Promise<Center>;
  updateCenter: (id: string, centerData: Center) => Promise<Center>;
  addDoctorsToCenter: (
    centerId: string,
    doctors: Array<{ doctorId: string; isAdmin: boolean }>,
  ) => Promise<any>;
  getCenterDoctors: (centerId: string) => Promise<any[]>;
  getDoctorCenters: (doctorId: string) => Promise<any[]>;
  savePhotoCenter: (photo: FormData, centerId: string) => Promise<any>;
  savePhotoUser: (photo: FormData, userId: string) => Promise<any>;
  getSecretaryDoctors: (secretaryId: string) => Promise<DoctorProfile[]>;
  addDoctorsToSecretary: (
    secretaryId: string,
    doctorId: Array<string>,
  ) => Promise<any>;
  sendContactMessage: (values: {
    name: string;
    phone: string;
    email: string;
    message: string;
  }) => Promise<any>;
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openingHour, setOpeningHour] = useState<OpeningHour[]>([]);

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
    async (dateRange?: DateRange, userId?: string): Promise<EventInput[]> => {
      setLoading(true);
      try {
        const data: EventInput[] = await userService.getEvents(
          dateRange,
          userId,
        );
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

  async function getUsersAdmin(role: number, q?: string): Promise<any[]> {
    const data = await userService.getUsersAdmin(role, q);
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
    duration?: number,
    numberOfDays?: number,
  ): Promise<any[]> {
    const data = await userService.getAvailableSlots(
      doctorId,
      date,
      duration,
      numberOfDays,
    );
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
    return data;
  }

  async function getOpeningHoursCenter(id) {
    const data = await userService.getOpeningHoursCenter(id);
    return data;
  }

  async function saveOpeningHoursCenter(
    id: string,
    openingHours: OpeningHour[],
  ) {
    const data = await userService.saveOpeningHoursCenter(id, openingHours);
    return data;
  }

  async function getReasonsClient(id: string) {
    const data = await userService.getReasonsClient(id);
    return data;
  }

  async function getReasons(id: string) {
    const data = await userService.getReasons(id);
    return data;
  }

  async function saveReasons(id: string, reasons: ConsultationReason[]) {
    const data = await userService.saveReasons(id, reasons);
    return data;
  }

  async function searchClient(search: string, userId?: string) {
    const data = await userService.searchClient(search, userId);
    return data;
  }

  async function checkValidSelection(
    id: string,
    reasonId: number,
    slot: string,
  ) {
    const data = await userService.checkValidSelection(id, reasonId, slot);
    return data;
  }

  async function createRdv(doctorId: string, slot: string, reasonId: number) {
    const data = await userService.createRdv(doctorId, slot, reasonId);
    return data;
  }

  async function getRdvHistoryDoctor(id: number) {
    const data = await userService.getRdvHistoryDoctor(id);
    return data;
  }

  async function getRdvNotificationsDoctor(eventId: string) {
    const data = await userService.getRdvNotificationsDoctor(eventId);
    return data;
  }

  async function createCenter(centerData: Center) {
    const data = await userService.createCenter(centerData);
    return data;
  }

  async function getCenters() {
    const data = await userService.getCenters();
    return data;
  }

  async function updateCenter(id: string, centerData: Center) {
    const data = await userService.updateCenter(id, centerData);
    return data;
  }

  async function getCenter(id: string) {
    const data = await userService.getCenter(id);
    return data;
  }

  async function addDoctorsToCenter(
    centerId: string,
    doctors: Array<{ doctorId: string; isAdmin: boolean }>,
  ) {
    const data = await userService.addDoctorsToCenter(centerId, doctors);
    return data;
  }

  async function getCenterDoctors(centerId: string) {
    const data = await userService.getCenterDoctors(centerId);
    return data;
  }

  async function getDoctorCenters(doctorId: string) {
    const data = await userService.getDoctorCenters(doctorId);
    return data;
  }

  async function savePhotoCenter(photo: FormData, centerId: string) {
    const data = await userService.savePhotoCenter(photo, centerId);
    return data;
  }

  async function savePhotoUser(photo: FormData, userId: string) {
    const data = await userService.savePhotoUser(photo, userId);
    return data;
  }

  async function addDoctorsToSecretary(
    secretaryId: string,
    doctors: Array<string>,
  ) {
    const data = await userService.addDoctorsToSecretary(secretaryId, doctors);
    return data;
  }

  async function getSecretaryDoctors(secretaryId: string) {
    const data = await userService.getSecretaryDoctors(secretaryId);
    return data;
  }

  async function sendContactMessage(values: {
    name: string;
    phone: string;
    email: string;
    message: string;
  }) {
    const data = await userService.sendContactMessage(values);
    return data;
  }

  return (
    <UserContext.Provider
      value={{
        events,
        isLoading,
        openingHour,
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
        getOpeningHoursCenter,
        saveOpeningHoursCenter,
        getReasonsClient,
        getReasons,
        saveReasons,
        searchClient,
        checkValidSelection,
        createRdv,
        getRdvHistoryDoctor,
        getRdvNotificationsDoctor,
        createCenter,
        getCenters,
        getCenter,
        updateCenter,
        addDoctorsToCenter,
        getCenterDoctors,
        getDoctorCenters,
        savePhotoCenter,
        savePhotoUser,
        getSecretaryDoctors,
        addDoctorsToSecretary,
        sendContactMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
