import { Property } from "../entities/Property";
import { PropertyFilters, PropertyFormData } from "../types/property.types";

/**
 * Repository interface for Property operations
 * This defines the contract that infrastructure layer must implement
 */
export interface IPropertyRepository {
  /**
   * Get all properties
   */
  getAll(): Promise<Property[]>;

  /**
   * Get a property by ID
   */
  getById(id: string): Promise<Property | null>;

  /**
   * Create a new property
   */
  create(data: PropertyFormData): Promise<Property>;

  /**
   * Update an existing property
   */
  update(id: string, data: Partial<PropertyFormData>): Promise<Property>;

  /**
   * Delete a property
   */
  delete(id: string): Promise<boolean>;

  /**
   * Filter properties based on criteria
   */
  filter(filters: PropertyFilters): Promise<Property[]>;

  /**
   * Get featured properties
   */
  getFeatured(): Promise<Property[]>;
}
