import { EventInput } from '@fullcalendar/core/index.js';
import { DateRange } from '../../types/date';
import { User } from '@/types/user';
import { OpeningHour } from '@/types/openingHour';
import { ConsultationReason } from '@/types/consultationReason';

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
  async searchPatient(firstName: string, lastName: string, birthDate: string) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/patients/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, birthDate }),
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },
  async getPatient(id: string) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async getEvents(dateRange?: DateRange) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    let url = `${API_URL}/events`;

    // Ajouter les paramètres de date si une plage est fournie
    if (dateRange) {
      const params = new URLSearchParams({
        start: dateRange.start,
        end: dateRange.end,
      });
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async createEvent(event: EventInput) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async updateEvent(event: EventInput) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async getDoctor(doctorIdentifier: string) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/doctor/${doctorIdentifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async searchDoctors(
    address: string,
    lat: string,
    lng: string,
    locale: string,
    q: string,
  ) {
    const res = await fetch(
      `${API_URL}/doctor/search?address=${address}&lat=${lat}&lng=${lng}&q=${q}&locale=${locale}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async searchDoctorAutocomplete(query: string, locale: string) {
    const res = await fetch(
      `${API_URL}/doctor/search/autocomplete?q=${query}&locale=${locale}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async getUsersAdmin(role: number) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }
    const res = await fetch(`${API_URL}/admin/user?role=${role}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async getAvailableSlots(doctorId: string, date: string) {
    const res = await fetch(
      `${API_URL}/doctor/${doctorId}/available-slots?date=${date}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<any>;
  },

  async createUser(userData: {
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
  }): Promise<User> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }
    const data = await fetch(`${API_URL}/admin/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!data.ok) {
      throw data;
    }
    return data.json() as Promise<User>;
  },

  async updateUser(
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
  ): Promise<User> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Ne pas envoyer le mot de passe s'il est vide
    const dataToSend = { ...userData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    const response = await fetch(`${API_URL}/admin/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    return response.json();
  },

  async saveSubSpecialities(userId: string, subSpecialityId: number[]) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_URL}/user/${userId}/sub-specialities/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subSpecialityId }),
      },
    );

    return response.json();
  },

  async getOpeningHours(userId: string): Promise<OpeningHour[]> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/user/${userId}/opening-hours`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async saveOpeningHours(
    userId: string,
    openingHours: Omit<OpeningHour, 'id'>[],
  ): Promise<OpeningHour[]> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/user/${userId}/opening-hours/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ openingHours }),
    });

    return response.json();
  },

  async getReasons(userId: string): Promise<ConsultationReason[]> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/user/${userId}/reasons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async saveReasons(userId: string, reasons: ConsultationReason[]) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/user/${userId}/reasons/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reasons }),
    });

    return response.json();
  },
};
