export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  roleId: number;
  avatar: string | null;
  phoneNumber: string | null;
  birthDate: string | null;
  genderId: number | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  centerId: number | null;
  specialityId: number | null;
  active: boolean;
  visible: boolean;
  subSpecialitiesUsers: [
    { id: number; userId: number; subSpecialityId: number },
  ];
};
