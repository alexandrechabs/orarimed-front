import { EventInput } from '@fullcalendar/core/index.js';
import { DateRange } from '../../types/date';

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
};
