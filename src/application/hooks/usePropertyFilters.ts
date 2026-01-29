import { useState, useEffect } from "react";
import { PropertyFilters } from "../../domain/types/property.types";
import { PropertyType, OperationType } from "../../domain/enums/PropertyType";
import { PRICE_RANGES, AREA_RANGES } from "../constants/propertyConstants";

/**
 * Custom hook for managing property filters state
 */
export function usePropertyFilters() {
  const [filters, setFilters] = useState<PropertyFilters>({
    operationType: undefined,
    propertyType: undefined,
    minPrice: PRICE_RANGES.MIN,
    maxPrice: PRICE_RANGES.MAX,
    minArea: AREA_RANGES.MIN,
    maxArea: AREA_RANGES.MAX,
    bedrooms: undefined,
    bathrooms: undefined,
    searchQuery: "",
  });

  /**
   * Update a specific filter
   */
  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Update multiple filters at once
   */
  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      operationType: undefined,
      propertyType: undefined,
      minPrice: PRICE_RANGES.MIN,
      maxPrice: PRICE_RANGES.MAX,
      minArea: AREA_RANGES.MIN,
      maxArea: AREA_RANGES.MAX,
      bedrooms: undefined,
      bathrooms: undefined,
      searchQuery: "",
    });
  };

  /**
   * Set price range
   */
  const setPriceRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  /**
   * Set area range
   */
  const setAreaRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minArea: min,
      maxArea: max,
    }));
  };

  /**
   * Set property type
   */
  const setPropertyType = (type: PropertyType | undefined) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: type,
    }));
  };

  /**
   * Set operation type
   */
  const setOperationType = (type: OperationType | undefined) => {
    setFilters((prev) => ({
      ...prev,
      operationType: type,
    }));
  };

  /**
   * Set search query
   */
  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = (): boolean => {
    return (
      filters.operationType !== undefined ||
      filters.propertyType !== undefined ||
      filters.minPrice !== PRICE_RANGES.MIN ||
      filters.maxPrice !== PRICE_RANGES.MAX ||
      filters.minArea !== AREA_RANGES.MIN ||
      filters.maxArea !== AREA_RANGES.MAX ||
      filters.bedrooms !== undefined ||
      filters.bathrooms !== undefined ||
      (filters.searchQuery !== undefined && filters.searchQuery.length > 0)
    );
  };

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    setPriceRange,
    setAreaRange,
    setPropertyType,
    setOperationType,
    setSearchQuery,
    hasActiveFilters,
  };
}
