export type DoctorSpecialityStatistic = {
  specialityId: number;
  slug: string;
  doctors: number;
};

export type AdminStatistics = {
  doctors: number;
  users: number;
  secretaries: number;
  offices: number;
  appointments: number;
  upcomingAppointments: number;
  doctorsBySpeciality: DoctorSpecialityStatistic[];
  appointmentsByMonth: {
    month: string;
    appointments: number;
  }[];
};

function isDoctorSpecialityStatistic(
  value: unknown,
): value is DoctorSpecialityStatistic {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.specialityId === "number" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.doctors === "number"
  );
}

const API_URL = import.meta.env.VITE_API_URL;

export const statisticsService = {
  async getAdminStatistics(): Promise<AdminStatistics> {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/admin/statistics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load admin statistics");

    const result: unknown = await response.json();
    if (!result || typeof result !== "object") {
      throw new Error("Invalid admin statistics response");
    }

    const payload = "data" in result ? result.data : result;
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid admin statistics response");
    }

    return payload as AdminStatistics;
  },
};
