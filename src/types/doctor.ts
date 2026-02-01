import { OpeningHour } from './openingHour';

export type DoctorProfile = {
  id: string;
  doctorIdentifier: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  speciality: {
    id: string;
    name: string;
    translations: Array<{
      id: string;
      name: string;
      locale: string;
    }>;
  };
  subSpecialitiesUsers: Array<{
    id: string;
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
  languages?: string[];
  paymentMethods?: string[];
  slots?: Array<{
    start: string | Date;
    end: string | Date;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    university: string;
    year: number;
  }>;
  experiences?: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
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
};
