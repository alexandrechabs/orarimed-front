export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  roleId: number;
  phoneNumber: string | null;
  birthDate: string | null;
  genderId: number | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  centerId: number | null;
  specialityId: number | null;
  subSpecialitiesUsers: [
    { id: number; userId: number; subSpecialityId: number },
  ];
};
