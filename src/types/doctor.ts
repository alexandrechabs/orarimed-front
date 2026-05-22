import { CenterUser } from "./CenterUser";
import { Diploma } from "./diploma";
import { Experience } from "./experience";
import { OpeningHour } from "./openingHour";

export type DoctorProfile = {
  id: string;
  doctorIdentifier: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  visible: boolean;
  coordinate?: {
    x: number;
    y: number;
  };
  speciality: {
    id: string;
    slug: string;
    translations: Array<{
      id: string;
      name: string;
      locale: string;
    }>;
  };
  subSpecialitiesUsers: Array<{
    id: number;
    subSpecialityId: number;
    subSpeciality: {
      id: string;
      slug: string;
      translations: Array<{
        id: string;
        name: string;
        locale: string;
      }>;
    };
  }>;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  avatar?: string;
  bio?: string;
  description?: string;
  price?: number;
  duration?: number;
  language: string;
  paymentMethods?: string[];
  slots?: Array<{
    start: string | Date;
    end: string | Date;
  }>;
  diplomas?: Array<Diploma>;
  experiences?: Array<Experience>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    patient: {
      id: string;
      firstname: string;
      lastname: string;
      avatar?: string;
    };
    createdAt: string;
  }>;
  openingHours?: OpeningHour[];
  centerUsers?: CenterUser[];
};
