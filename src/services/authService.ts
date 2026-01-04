const API_URL = 'http://localhost:3334';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roleId: number;
};

type Token = {
  type: string;
  name: string | null;
  token: string;
  abilities: string[];
  lastUsedAt: string | null;
  expiresAt: string;
};

type AuthResponse = {
  user: User;
  token: Token;
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Fonction utilitaire pour stocker les données d'authentification
const storeAuthData = (data: AuthResponse) => {
  localStorage.setItem(AUTH_TOKEN_KEY, data.token.token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
};

// Fonction pour récupérer le token d'authentification
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Fonction pour récupérer les informations de l'utilisateur connecté
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Fonction pour se déconnecter
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error during registration');
    }

    const data: AuthResponse = await response.json();
    storeAuthData(data);
    return data;
  },

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const data: AuthResponse = await response.json();
    console.log(data);

    storeAuthData(data);
    return data;
  },

  logout,
  getCurrentUser,
  isAuthenticated,
  getAuthToken,
};
