import { Property } from "../../domain/entities/Property";
import {
  PropertyFormData,
  PropertyFilters,
} from "../../domain/types/property.types";
import { IPropertyRepository } from "../../domain/interfaces/IPropertyRepository";

/**
 * Property Service - Business logic for property operations
 * This service coordinates between the UI and the data layer
 */
export class PropertyService {
  constructor(private repository: IPropertyRepository) {}

  /**
   * Get all properties
   */
  async getAllProperties(): Promise<Property[]> {
    return await this.repository.getAll();
  }

  /**
   * Get a single property by ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    return await this.repository.getById(id);
  }

  /**
   * Create a new property
   */
  async createProperty(data: PropertyFormData): Promise<Property> {
    // Add business logic validation here if needed
    this.validatePropertyData(data);
    return await this.repository.create(data);
  }

  /**
   * Update an existing property
   */
  async updateProperty(
    id: string,
    data: Partial<PropertyFormData>,
  ): Promise<Property> {
    return await this.repository.update(id, data);
  }

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  /**
   * Filter properties based on criteria
   */
  async filterProperties(filters: PropertyFilters): Promise<Property[]> {
    return await this.repository.filter(filters);
  }

  /**
   * Get featured properties for homepage
   */
  async getFeaturedProperties(): Promise<Property[]> {
    return await this.repository.getFeatured();
  }

  /**
   * Search properties by query string
   */
  async searchProperties(query: string): Promise<Property[]> {
    const filters: PropertyFilters = {
      searchQuery: query,
    };
    return await this.repository.filter(filters);
  }

  /**
   * Validate property data before creation/update
   */
  private validatePropertyData(data: PropertyFormData): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("El título es requerido");
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("La descripción es requerida");
    }
    if (data.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (data.characteristics.area <= 0) {
      throw new Error("El área debe ser mayor a 0");
    }
    if (!data.location.address || data.location.address.trim().length === 0) {
      throw new Error("La dirección es requerida");
    }
  }
}

// Export a default instance (will be initialized with repository later)
let propertyServiceInstance: PropertyService | null = null;

export function initializePropertyService(
  repository: IPropertyRepository,
): PropertyService {
  propertyServiceInstance = new PropertyService(repository);
  return propertyServiceInstance;
}

export function getPropertyService(): PropertyService {
  if (!propertyServiceInstance) {
    throw new Error(
      "PropertyService not initialized. Call initializePropertyService first.",
    );
  }
  return propertyServiceInstance;
}
