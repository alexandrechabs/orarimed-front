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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  useEffect(() => {
    // Vérifiez le stockage local au chargement
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from localStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const data = await authService.login({ email, password });

    setUser(data.user);
    localStorage.setItem('user_data', JSON.stringify(data.user));
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
    localStorage.setItem('user_data', JSON.stringify(data.user));
    localStorage.setItem('auth_token', data.token.token);
  }

  async function updateUser(params: any) {
    const data = await authService.updateUser(user.id, params);
    setUser(data);
    localStorage.setItem('user_data', JSON.stringify(data));
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
