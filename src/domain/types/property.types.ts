import { PropertyType, OperationType } from "../enums/PropertyType";

/**
 * Location information for a property
 */
export interface PropertyLocation {
  address: string;
  city: string;
  department: string;
  neighborhood: string;
  postalCode: string;
}

/**
 * Characteristics of a property
 */
export interface PropertyCharacteristics {
  bedrooms: number;
  bathrooms: number;
  area: number; // in m²
  parkingSpots: number;
  furnished: boolean;
  floors?: number;
  totalFloors?: number;
  age?: number; // in years
  stratum?: number;
}

/**
 * Additional amenities for a property
 */
export interface PropertyAmenities {
  pool?: boolean;
  gym?: boolean;
  garden?: boolean;
  terrace?: boolean;
  balcony?: boolean;
  security24?: boolean;
  gameArea?: boolean;
  eventRoom?: boolean;
  equippedKitchen?: boolean;
  management?: boolean;
  closets?: boolean;
  airConditioning?: boolean;
  cafeteria?: boolean;
  petsAllowed?: boolean;
}

/**
 * Filter criteria for searching properties
 */
export interface PropertyFilters {
  operationType?: OperationType;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  department?: string;
  searchQuery?: string;
}

/**
 * Form data for creating/editing a property
 */
export interface PropertyFormData {
  title: string;
  description: string;
  propertyType: PropertyType;
  operationType: OperationType;
  price: number;
  location: PropertyLocation;
  characteristics: PropertyCharacteristics;
  amenities: PropertyAmenities;
  images: string[];
}
