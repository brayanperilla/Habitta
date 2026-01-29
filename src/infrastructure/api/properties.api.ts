import { Property } from "../../domain/entities/Property";
import {
  PropertyFormData,
  PropertyFilters,
} from "../../domain/types/property.types";
import { API_CONFIG } from "../config/env";

/**
 * API functions for property-related operations
 * These functions handle the HTTP requests to the backend API
 */

/**
 * Fetch all properties
 */
export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    // For now, return mock data
    return getMockProperties();
  }
}

/**
 * Fetch a single property by ID
 */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    return null;
  }
}

/**
 * Create a new property
 */
export async function createProperty(
  data: PropertyFormData,
): Promise<Property> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

/**
 * Update an existing property
 */
export async function updateProperty(
  id: string,
  data: Partial<PropertyFormData>,
): Promise<Property> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    return false;
  }
}

/**
 * Filter properties based on criteria
 */
export async function filterProperties(
  filters: PropertyFilters,
): Promise<Property[]> {
  try {
    const queryParams = new URLSearchParams();

    if (filters.operationType)
      queryParams.append("operationType", filters.operationType);
    if (filters.propertyType)
      queryParams.append("propertyType", filters.propertyType);
    if (filters.minPrice)
      queryParams.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      queryParams.append("maxPrice", filters.maxPrice.toString());
    if (filters.minArea)
      queryParams.append("minArea", filters.minArea.toString());
    if (filters.maxArea)
      queryParams.append("maxArea", filters.maxArea.toString());
    if (filters.bedrooms)
      queryParams.append("bedrooms", filters.bedrooms.toString());
    if (filters.bathrooms)
      queryParams.append("bathrooms", filters.bathrooms.toString());
    if (filters.searchQuery) queryParams.append("q", filters.searchQuery);

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error filtering properties:", error);
    // For now, return mock data
    return getMockProperties();
  }
}

/**
 * Mock properties for development
 * TODO: Remove when real API is available
 */
function getMockProperties(): Property[] {
  return [];
}
