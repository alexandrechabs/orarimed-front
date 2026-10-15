import { EventInput } from "@fullcalendar/core/index.js";
import { DateRange } from "../../types/date";
import { User } from "@/types/user";
import { OpeningHour } from "@/types/openingHour";
import { ConsultationReason } from "@/types/consultationReason";
import { Center } from "@/types/center";
import { Diploma } from "@/types/diploma";
import { DoctorProfile } from "@/types/doctor";
import { Experience } from "@/types/experience";

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
  async searchPatient(firstName: string, lastName: string, birthDate: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${API_URL}/patients/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, birthDate }),
    });

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },
  async getPatient(id: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async getEvent(id: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${API_URL}/events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Get event failed");
    return res.json() as Promise<any>;
  },

  async getEvents(dateRange?: DateRange, userId?: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
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

    if (userId) {
      url += `${url.includes("?") ? "&" : "?"}userId=${userId}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async createEvent(event: EventInput) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async updateEvent(event: EventInput) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${API_URL}/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async getDoctor(doctorIdentifier: string) {
    const res = await fetch(`${API_URL}/doctor/${doctorIdentifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async searchDoctors(
    address: string,
    lat: string,
    lng: string,
    locale: string,
    q: string,
    page?: number,
  ) {
    const res = await fetch(
      `${API_URL}/doctor/search?address=${address}&lat=${lat}&lng=${lng}&q=${q}&locale=${locale}${page ? `&page=${page}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<{
      meta: {
        total: number;
        currentPage: number;
        firstPage: number;
        lastPage: number;
      };
      data: DoctorProfile[];
    }>;
  },

  async searchDoctorAutocomplete(query: string, locale: string) {
    const res = await fetch(
      `${API_URL}/doctor/search/autocomplete?q=${query}&locale=${locale}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async getUsersAdmin(role: number, q?: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    const res = await fetch(
      `${API_URL}/admin/user?role=${role}${q ? `&q=${q}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async getAvailableSlots(
    doctorId: string,
    date: string,
    duration?: number,
    numberOfDays?: number,
  ) {
    const res = await fetch(
      `${API_URL}/doctor/${doctorId}/available-slots?date=${date}${
        duration ? `&duration=${duration}` : ""
      }${numberOfDays ? `&numberOfDays=${numberOfDays}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("Get user failed");
    return res.json() as Promise<any>;
  },

  async createUser(userData: {
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
    roleId: number;
    visible?: boolean;
    specialityId?: number;
    acceptTerms: boolean;
  }): Promise<User> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    const data = await fetch(`${API_URL}/admin/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  ): Promise<User> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ne pas envoyer le mot de passe s'il est vide
    const dataToSend = { ...userData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    const response = await fetch(`${API_URL}/admin/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return response.json();
  },

  async saveSubSpecialities(userId: string, subSpecialityId: number[]) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/user/${userId}/sub-specialities/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subSpecialityId }),
      },
    );

    return response.json();
  },

  async getOpeningHours(userId: string): Promise<OpeningHour[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/opening-hours`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async getOpeningHoursCenter(centerId: string): Promise<OpeningHour[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/center/${centerId}/opening-hours`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.json();
  },

  async saveOpeningHours(
    userId: string,
    openingHours: Omit<OpeningHour, "id">[],
  ): Promise<OpeningHour[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/opening-hours/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ openingHours }),
    });

    return response.json();
  },

  async saveOpeningHoursCenter(
    centerId: string,
    openingHours: Omit<OpeningHour, "id">[],
  ): Promise<OpeningHour[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/center/${centerId}/opening-hours/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ openingHours }),
      },
    );

    return response.json();
  },

  async getReasonsClient(userId: string): Promise<ConsultationReason[]> {
    const response = await fetch(`${API_URL}/doctor/${userId}/reasons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  async getReasons(userId: string): Promise<ConsultationReason[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/reasons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async getStatsDoctor(): Promise<ConsultationReason[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/doctor/statistics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async saveReasons(userId: string, reasons: ConsultationReason[]) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/reasons/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reasons }),
    });

    return response.json();
  },

  async getDiplomas(userId: string): Promise<Diploma[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/diplomas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Get diplomas failed");
    }

    return response.json();
  },

  async createDiploma(
    userId: string,
    diploma: {
      title: string;
      institution: string;
      year: number;
      field?: string | null;
    },
  ): Promise<Diploma> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/diplomas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(diploma),
    });

    if (!response.ok) {
      throw new Error("Create diploma failed");
    }

    return response.json();
  },

  async updateDiploma(
    userId: string,
    diplomaId: number,
    diploma: {
      title: string;
      institution: string;
      year: number;
      field?: string | null;
    },
  ): Promise<Diploma> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/user/${userId}/diplomas/${diplomaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(diploma),
      },
    );

    if (!response.ok) {
      throw new Error("Update diploma failed");
    }

    return response.json();
  },

  async deleteDiploma(userId: string, diplomaId: number) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/user/${userId}/diplomas/${diplomaId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Delete diploma failed");
    }

    return response.json();
  },

  async getExperiences(userId: string): Promise<Experience[]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/experiences`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Get experiences failed");
    }

    return response.json();
  },

  async createExperience(
    userId: string,
    experience: {
      company: string;
      startYear: string;
      endYear: string;
      description?: string;
    },
  ): Promise<Experience> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/experiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(experience),
    });

    if (!response.ok) {
      throw new Error("Create experience failed");
    }

    return response.json();
  },

  async updateExperience(
    userId: string,
    experienceId: number,
    experience: {
      company: string;
      startYear: string;
      endYear: string;
      description?: string;
    },
  ): Promise<Experience> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/user/${userId}/experiences/${experienceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experience),
      },
    );

    if (!response.ok) {
      throw new Error("Update experience failed");
    }

    return response.json();
  },

  async deleteExperience(userId: string, experienceId: number) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/user/${userId}/experiences/${experienceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Delete experience failed");
    }

    return response.json();
  },

  async searchClient(search: string, userId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/patients/search?search=${search}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.json();
  },

  async checkValidSelection(id: string, reasonId: number, slot: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/doctor/${id}/check-valid-selection?reasonId=${reasonId}&slot=${slot}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.json();
  },

  async createRdv(doctorId: string, slot: string, reasonId: number) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/doctor/${doctorId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ slot, reasonId }),
    });

    return response.json();
  },

  async getRdvHistoryDoctor(id: number) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/contact/${id}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async getRdvNotificationsDoctor(eventId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/events/${eventId}/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async createCenter(centerData: Center) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/center`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(centerData),
    });

    return response.json();
  },

  async getCenters() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/center`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async getCenter(id: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/center/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async updateCenter(id: string, centerData: Center) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/center/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(centerData),
    });

    return response.json();
  },

  async addDoctorsToCenter(
    centerId: string,
    doctors: Array<{ doctorId: string; isAdmin: boolean }>,
  ) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/center/${centerId}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctors }),
    });

    if (!response.ok) {
      throw new Error("Failed to add doctors to center");
    }

    return response.json();
  },

  async getCenterDoctors(centerId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${API_URL}/center/${centerId}/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get center doctors");
    }

    return response.json();
  },

  async getDoctorCenters(doctorId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${API_URL}/doctor/${doctorId}/centers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get center doctors");
    }

    return response.json();
  },

  async savePhotoCenter(photo: FormData, centerId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/center/${centerId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: photo,
    });

    return response.json();
  },

  async savePhotoUser(photo: FormData, userId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/user/${userId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: photo,
    });

    return response.json();
  },

  async addDoctorsToSecretary(secretaryId: string, doctors: Array<string>) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/secretary/${secretaryId}/doctors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctors }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to add doctors to secretary");
    }

    return response.json();
  },

  async getSecretaryDoctors(secretaryId: string) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(
      `${API_URL}/secretary/${secretaryId}/doctors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get secretary doctors");
    }

    return response.json();
  },

  async sendContactMessage(values: {
    name: string;
    phone: string;
    email: string;
    message: string;
  }) {
    const response = await fetch(`${API_URL}/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Failed to send contact message");
    }

    return response.json();
  },
};
