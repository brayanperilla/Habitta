/**
 * User authentication credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  token: string;
  user: UserData;
}

/**
 * User data structure
 */
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
}
