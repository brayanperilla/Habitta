import type { Property } from "@domain/entities/Property";
import { propertyApi } from "@infrastructure/api/properties.api";

export const propertyService = {
  getProperties: async (): Promise<Property[]> => {
    return await propertyApi.getAll();
  },
  createProperty: async (property: Omit<Property, "id">): Promise<Property> => {
    // Aquí agregamos validación de lógica de negocios.
    return await propertyApi.create(property);
  },
};
