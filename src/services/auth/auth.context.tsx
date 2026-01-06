import { createContext, useEffect, useState } from 'react';
import { authService } from './auth.service';
import { User } from '@/types/user';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<void>;
  updateUser: (params: any) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<String>(() => {
    const saved = localStorage.getItem('auth_token');
    return (saved as String) || '';
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  useEffect(() => {
    // Vérifiez le stockage local au chargement
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

    setUser(data.user);
    setToken(data.token.token);
    localStorage.setItem('auth_token', data.token.token);
  }

  async function register(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) {
    const data = await authService.register({
      firstname,
      lastname,
      email,
      password,
    });

    setUser(data.user);
    setToken(data.token.token);
    localStorage.setItem('auth_token', data.token.token);
  }

  async function getMyUser() {
    const data = await authService.getMyUser();
    setUser(data);
  }

  async function updateUser(params: any) {
    const data = await authService.updateUser(user.id, params);
    setUser(data);
  }

  function logout() {
    setUser(null);
    localStorage.clear();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
