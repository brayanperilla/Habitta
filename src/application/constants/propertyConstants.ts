import { PropertyType, OperationType } from "../../domain/enums/PropertyType";

/**
 * Price range constants for property filters
 */
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 7560000000, // 7.56B COP
  DEFAULT: 3780000000, // 3.78B COP
  STEP: 100000, // 100K COP
};

/**
 * Area range constants for property filters
 */
export const AREA_RANGES = {
  MIN: 0,
  MAX: 870, // m²
  DEFAULT: 435, // m²
  STEP: 10, // m²
};

/**
 * Property type options for filters and forms
 */
export const PROPERTY_TYPE_OPTIONS = [
  { value: PropertyType.HOUSE, label: "Casa" },
  { value: PropertyType.APARTMENT, label: "Apartamento" },
  { value: PropertyType.LOT, label: "Lote" },
];

/**
 * Operation type options for filters and forms
 */
export const OPERATION_TYPE_OPTIONS = [
  { value: OperationType.SALE, label: "Venta" },
  { value: OperationType.RENT, label: "Arriendo" },
];

/**
 * Bedroom options
 */
export const BEDROOM_OPTIONS = [1, 2, 3, 4];

/**
 * Bathroom options
 */
export const BATHROOM_OPTIONS = [1, 2, 3, 4];

/**
 * Sort options for properties listing
 */
export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price_desc", label: "Mayor a menor precio" },
  { value: "price_asc", label: "Menor a mayor precio" },
  { value: "date_desc", label: "Más recientes" },
];

/**
 * Maximum number of images allowed per property
 */
export const MAX_PROPERTY_IMAGES = 15;

/**
 * Default property image placeholder
 */
export const DEFAULT_PROPERTY_IMAGE = "/placeholder-property.jpg";
