import { ConsultationReason } from '@/types/consultationReason';
import { OpeningHour } from '@/types/openingHour';
import { Speciality } from '@/types/specialty';
import { Token } from '@/types/token';
import { User } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL;

type AuthResponse = {
  user: User;
  token: Token;
};

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error('Invalid credentials');
    return res.json() as Promise<AuthResponse>;
  },

  async register(data: any) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Register failed');
    return res.json() as Promise<AuthResponse>;
  },

  async getMyUser() {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/user/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Get user failed');
    return res.json() as Promise<User>;
  },

  async updateUser(userId: string, params: any) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error('Update failed');
    return res.json() as Promise<User>;
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

  async getSpecialities() {
    const response = await fetch(`${API_URL}/specialities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  },

  async saveSpecialities(specialities: Speciality[]) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/specialities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ specialities }),
    });

    return response.json();
  },

  async saveSubSpecialities(subSpecialities: number[], userId: string) {
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
        body: JSON.stringify({ subSpecialities }),
      },
    );

    return response.json();
  },

  async savePhotoUser(photo: FormData, userId: string) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/user/${userId}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: photo,
    });

    return response.json();
  },
};
