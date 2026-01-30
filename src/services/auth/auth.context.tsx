import { createContext, useEffect, useState } from 'react';
import { authService } from './auth.service';
import { User } from '@/types/user';
import { OpeningHour } from '@/types/openingHour';
import { Speciality } from '@/types/specialty';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  openingHour: OpeningHour[] | null;
  specialities: any[] | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    acceptTerms: boolean,
    kind: number,
  ) => Promise<void>;
  getMyUser: () => void;
  updateUser: (params: any) => void;
  getOpeningHours: () => Promise<OpeningHour[]>;
  saveOpeningHours: (openingHours: OpeningHour[]) => Promise<OpeningHour[]>;
  getSpecialities: () => Promise<any>;
  saveSpecialities: (specialities: any) => Promise<Speciality[]>;
  saveSubSpecialities: (subSpecialities: number[]) => void;
  savePhotoUser: (photo: FormData) => Promise<any>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<String>(() => {
    const saved = localStorage.getItem('auth_token');
    return (saved as String) || '';
  });
  const [user, setUser] = useState<User | null>(null);
  const [openingHour, setOpeningHour] = useState<OpeningHour[] | null>(null);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  useEffect(() => {
    // Vérifiez le stockage local au chargement

    getSpecialities();
    const loadUser = async () => {
      try {
        await getMyUser();
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const data = await authService.login({ email, password });

    setToken(data.token.token);
    localStorage.setItem('auth_token', data.token.token);
    await getMyUser();
  }

  async function register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    acceptTerms: boolean,
    kind: number,
  ) {
    const data = await authService.register({
      firstname,
      lastname,
      email,
      password,
      acceptTerms,
      kind,
    });

    setUser(data.user);
    setToken(data.token.token);
    localStorage.setItem('auth_token', data.token.token);
  }

  async function getMyUser() {
    const data = await authService.getMyUser();
    setUser(data);
    return;
  }

  async function updateUser(params: any) {
    const data = await authService.updateUser(user.id, params);
    setUser(data);
  }

  function logout() {
    setUser(null);
    localStorage.clear();
  }

  async function getOpeningHours() {
    const data = await authService.getOpeningHours(user.id);
    setOpeningHour(data);
    return data;
  }

  async function saveOpeningHours(openingHours: OpeningHour[]) {
    const data = await authService.saveOpeningHours(user.id, openingHours);
    setOpeningHour(data);
    return data;
  }

  async function getSpecialities() {
    const data = await authService.getSpecialities();
    setSpecialities(data);
    return data;
  }

  async function saveSpecialities(params: Speciality[]) {
    const data = await authService.saveSpecialities(params);
    setSpecialities(data);
    return data;
  }

  function saveSubSpecialities(params: number[]) {
    const data = authService.saveSubSpecialities(params, user.id);
    return;
  }

  async function savePhotoUser(photo: FormData) {
    const data = await authService.savePhotoUser(photo, user.id);
    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        openingHour,
        specialities,
        login,
        register,
        getMyUser,
        logout,
        updateUser,
        getOpeningHours,
        saveOpeningHours,
        getSpecialities,
        saveSpecialities,
        saveSubSpecialities,
        savePhotoUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
