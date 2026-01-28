import { OpeningHour } from './openingHour';

export type DoctorProfile = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  city: string;
  address: string;
  phoneNumber: string;
  bio: string;
  speciality?: {
    id: number;
    slug: string;
    icon: string;
    color: string;
    translations: Array<{ locale: string; name: string }>;
  };
  subSpecialitiesUsers?: Array<{
    id: number;
    userId: number;
    subSpecialityId: number;
    subSpeciality?: {
      id: number;
      slug: string;
      translations: Array<{ locale: string; name: string }>;
    };
  }>;
  openingHours?: OpeningHour[];
};
