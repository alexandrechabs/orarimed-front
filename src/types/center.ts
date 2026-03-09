import { CenterUser } from './CenterUser';
import { OpeningHour } from './openingHour';

export type Center = {
  id?: string;
  avatar?: string;
  description: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  city: string;
  country: string;
  coordinate: {
    x: number;
    y: number;
  };
  centerIdentifier?: string;
  visible: boolean;
  active: boolean;
  specialityId: number;
  speciality?: {
    id: number;
    slug: string;
    translations: {
      locale: string;
      name: string;
    }[];
  };
  openingHours?: OpeningHour[];
  centerUsers?: CenterUser[];
};
