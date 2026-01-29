import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthState,
} from "../../domain/types/auth.types";
import { User } from "../../domain/entities/User";

/**
 * Authentication Service - Business logic for authentication operations
 */
export class AuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate credentials
    this.validateLoginCredentials(credentials);

    // TODO: Replace with actual API call
    // For now, simulate authentication
    const mockResponse: AuthResponse = {
      token: "mock-token-" + Date.now(),
      user: {
        id: "1",
        name: "Usuario Demo",
        email: credentials.email,
        createdAt: new Date().toISOString(),
      },
    };

    // Update auth state
    this.authState = {
      isAuthenticated: true,
      user: mockResponse.user,
      token: mockResponse.token,
    };

    // Store in localStorage
    localStorage.setItem("authToken", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));

    return mockResponse;
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate registration data
    this.validateRegistrationData(data);

    // TODO: Replace with actual API call
    const mockResponse: AuthResponse = {
      token: "mock-token-" + Date.now(),
      user: {
        id: "1",
        name: data.name,
        email: data.email,
        phone: data.phone,
        createdAt: new Date().toISOString(),
      },
    };

    // Update auth state
    this.authState = {
      isAuthenticated: true,
      user: mockResponse.user,
      token: mockResponse.token,
    };

    // Store in localStorage
    localStorage.setItem("authToken", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));

    return mockResponse;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
    };
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  /**
   * Get current auth state
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  /**
   * Restore auth state from localStorage
   */
  restoreAuthState(): void {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState = {
          isAuthenticated: true,
          user,
          token,
        };
      } catch (error) {
        this.logout();
      }
    }
  }

  /**
   * Validate login credentials
   */
  private validateLoginCredentials(credentials: LoginCredentials): void {
    if (!credentials.email || credentials.email.trim().length === 0) {
      throw new Error("El email es requerido");
    }
    if (!this.isValidEmail(credentials.email)) {
      throw new Error("El email no es válido");
    }
    if (!credentials.password || credentials.password.trim().length === 0) {
      throw new Error("La contraseña es requerida");
    }
    if (credentials.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
  }

  /**
   * Validate registration data
   */
  private validateRegistrationData(data: RegisterData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("El nombre es requerido");
    }
    if (!data.email || data.email.trim().length === 0) {
      throw new Error("El email es requerido");
    }
    if (!this.isValidEmail(data.email)) {
      throw new Error("El email no es válido");
    }
    if (!data.password || data.password.trim().length === 0) {
      throw new Error("La contraseña es requerida");
    }
    if (data.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
    if (data.password !== data.confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Export a singleton instance
export const authService = new AuthService();
