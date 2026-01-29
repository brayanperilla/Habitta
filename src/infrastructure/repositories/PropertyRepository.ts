import { IPropertyRepository } from "../../domain/interfaces/IPropertyRepository";
import { Property } from "../../domain/entities/Property";
import {
  PropertyFormData,
  PropertyFilters,
} from "../../domain/types/property.types";
import * as propertyApi from "../api/properties.api";

/**
 * PropertyRepository - Implementation of IPropertyRepository
 * This class implements data access logic for properties
 */
export class PropertyRepository implements IPropertyRepository {
  /**
   * Get all properties
   */
  async getAll(): Promise<Property[]> {
    return await propertyApi.fetchProperties();
  }

  /**
   * Get a property by ID
   */
  async getById(id: string): Promise<Property | null> {
    return await propertyApi.fetchPropertyById(id);
  }

  /**
   * Create a new property
   */
  async create(data: PropertyFormData): Promise<Property> {
    return await propertyApi.createProperty(data);
  }

  /**
   * Update an existing property
   */
  async update(id: string, data: Partial<PropertyFormData>): Promise<Property> {
    return await propertyApi.updateProperty(id, data);
  }

  /**
   * Delete a property
   */
  async delete(id: string): Promise<boolean> {
    return await propertyApi.deleteProperty(id);
  }

  /**
   * Filter properties based on criteria
   */
  async filter(filters: PropertyFilters): Promise<Property[]> {
    return await propertyApi.filterProperties(filters);
  }

  /**
   * Get featured properties
   */
  async getFeatured(): Promise<Property[]> {
    const allProperties = await this.getAll();
    return allProperties.filter((property) => property.isFeatured);
  }
}

// Export a singleton instance
export const propertyRepository = new PropertyRepository();
