/**
 * Enum for property types
 */
export enum PropertyType {
  HOUSE = "house",
  APARTMENT = "apartment",
  LOT = "lot",
}

/**
 * Enum for operation types
 */
export enum OperationType {
  SALE = "sale",
  RENT = "rent",
}

/**
 * Helper function to get display name for property type
 */
export function getPropertyTypeLabel(type: PropertyType): string {
  const labels = {
    [PropertyType.HOUSE]: "Casa",
    [PropertyType.APARTMENT]: "Apartamento",
    [PropertyType.LOT]: "Lote",
  };
  return labels[type];
}

/**
 * Helper function to get display name for operation type
 */
export function getOperationTypeLabel(type: OperationType): string {
  const labels = {
    [OperationType.SALE]: "Venta",
    [OperationType.RENT]: "Arriendo",
  };
  return labels[type];
}
