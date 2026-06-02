import { DoctorProfile } from "./doctor";

export type SecretaryUser = {
  id: string;
  doctorId: string;
  secretaryId: string;
  doctor?: DoctorProfile;
};
