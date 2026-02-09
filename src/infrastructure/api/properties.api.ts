import type { Property } from "@domain/entities/Property";

// Mock implementation for now
export const propertyApi = {
  getAll: async (): Promise<Property[]> => {
    // Simulate API call
    return [];
  },
  getById: async (id: string): Promise<Property | null> => {
    if (id) {
      // Mock implementation
      return null;
    }
    return null;
  },
  create: async (property: Omit<Property, "id">): Promise<Property> => {
    return { ...property, id: Math.random().toString() };
  },
};

