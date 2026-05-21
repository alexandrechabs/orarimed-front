import { createContext, useEffect, useState } from "react";
import { authService } from "./auth.service";
import { User } from "@/types/user";
import { Speciality } from "@/types/specialty";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  specialities: any[] | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    acceptTerms: boolean,
    roleId: number,
    language: string,
  ) => Promise<void>;
  getMyUser: () => void;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateUser: (params: any) => void;
  getSpecialities: () => Promise<any>;
  saveSpecialities: (specialities: any) => Promise<Speciality[]>;
  logout: () => void;
  sendResetCode: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    password: string,
  ) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, languages } = useLanguage();
  const [token, setToken] = useState<String>(() => {
    const saved = localStorage.getItem("auth_token");
    return (saved as String) || "";
  });
  const [user, setUser] = useState<User | null>(null);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  useEffect(() => {
    // Vérifiez le stockage local au chargement

    getSpecialities();
    const loadUser = async () => {
      try {
        await getMyUser();
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const data = await authService.login({ email, password });
    setToken(data.token.token);
    localStorage.setItem("auth_token", data.token.token);
    await getMyUser();
  }

  async function register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    acceptTerms: boolean,
    roleId: number,
    language: string,
  ) {
    const data = await authService.register({
      firstname,
      lastname,
      email,
      password,
      acceptTerms,
      roleId,
      language,
    });

    setUser(data.user);
    setToken(data.token.token);
    localStorage.setItem("auth_token", data.token.token);
  }

  async function getMyUser() {
    const data = await authService.getMyUser();
    if (language !== data.language) {
      setLanguage(
        languages.find((l) => l.code === data.language)?.code || "sq",
      );
    }
    setUser(data);
    return;
  }

  async function updateUser(params: any) {
    const data = await authService.updateUser(user.id, params);
    if (language !== data.language) {
      setLanguage(
        languages.find((l) => l.code === data.language)?.code || "sq",
      );
    }
    setUser(data);
  }

  function logout() {
    setUser(null);
    localStorage.clear();
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

  async function verifyEmail(code: string) {
    await authService.verifyEmail(code);
  }

  async function resendVerificationEmail() {
    await authService.resendVerificationEmail();
  }

  async function sendResetCode(email: string) {
    await authService.sendResetCode(email);
  }

  async function resetPassword(email: string, code: string, password: string) {
    await authService.resetPassword(email, code, password);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        specialities,
        login,
        register,
        getMyUser,
        verifyEmail,
        resendVerificationEmail,
        logout,
        updateUser,
        getSpecialities,
        saveSpecialities,
        sendResetCode,
        resetPassword,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
