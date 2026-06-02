import { Center } from "./center";
import { DoctorProfile } from "./doctor";

export type CenterUser = {
  id: string;
  centerId: string;
  userId: string;
  isAdmin: boolean;
  user?: DoctorProfile;
  center?: Center;
};
