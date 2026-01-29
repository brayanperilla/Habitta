import { useState, useEffect } from "react";
import {
  AuthState,
  LoginCredentials,
  RegisterData,
} from "../../domain/types/auth.types";
import { authService } from "../services/authService";

/**
 * Custom hook for managing authentication state
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(
    authService.getAuthState(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    authService.restoreAuthState();
    setAuthState(authService.getAuthState());
  }, []);

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      setAuthState(authService.getAuthState());
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      setAuthState(authService.getAuthState());
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar usuario";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setAuthState(authService.getAuthState());
    setError(null);
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
