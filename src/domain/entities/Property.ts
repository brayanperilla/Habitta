import { PropertyType, OperationType } from "../enums/PropertyType";
import {
  PropertyLocation,
  PropertyCharacteristics,
  PropertyAmenities,
} from "../types/property.types";

/**
 * Property Entity - Core domain model for a real estate property
 */
export class Property {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public propertyType: PropertyType,
    public operationType: OperationType,
    public price: number,
    public location: PropertyLocation,
    public characteristics: PropertyCharacteristics,
    public amenities: PropertyAmenities,
    public images: string[],
    public isFeatured: boolean = false,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  /**
   * Get formatted price in COP
   */
  getFormattedPrice(): string {
    return `$${this.price.toLocaleString("es-CO")} COP`;
  }

  /**
   * Get short location description
   */
  getLocationString(): string {
    return `${this.location.neighborhood}, ${this.location.city}`;
  }

  /**
   * Get main image URL
   */
  getMainImage(): string {
    return this.images.length > 0 ? this.images[0] : "";
  }

  /**
   * Check if property matches filter criteria
   */
  matchesFilters(filters: {
    operationType?: OperationType;
    propertyType?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    bathrooms?: number;
  }): boolean {
    if (filters.operationType && this.operationType !== filters.operationType) {
      return false;
    }
    if (filters.propertyType && this.propertyType !== filters.propertyType) {
      return false;
    }
    if (filters.minPrice && this.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && this.price > filters.maxPrice) {
      return false;
    }
    if (filters.minArea && this.characteristics.area < filters.minArea) {
      return false;
    }
    if (filters.maxArea && this.characteristics.area > filters.maxArea) {
      return false;
    }
    if (filters.bedrooms && this.characteristics.bedrooms < filters.bedrooms) {
      return false;
    }
    if (
      filters.bathrooms &&
      this.characteristics.bathrooms < filters.bathrooms
    ) {
      return false;
    }
    return true;
  }
}
