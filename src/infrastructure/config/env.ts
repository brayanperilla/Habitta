/**
 * Environment configuration
 * Centralized configuration for the application
 */

const getEnv = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || "";
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: getEnv("VITE_API_BASE_URL", "http://localhost:3000/api"),

  // API Endpoints
  ENDPOINTS: {
    PROPERTIES: "/properties",
    PROPERTY_BY_ID: (id: string) => `/properties/${id}`,
    AUTH_LOGIN: "/auth/login",
    AUTH_REGISTER: "/auth/register",
    AUTH_LOGOUT: "/auth/logout",
    USER_PROFILE: "/user/profile",
  },

  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  // Application name
  APP_NAME: "Habitta",

  // Version
  VERSION: "1.0.0",

  // Environment
  ENV: getEnv("VITE_ENV", "development"),

  // Is production
  IS_PRODUCTION: getEnv("VITE_ENV") === "production",
};

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "user",
  FAVORITES: "favorites",
};
