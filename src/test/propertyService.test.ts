import { describe, it, expect, vi, beforeEach } from "vitest";
import { propertyService } from "@application/services/propertyService";
import { propertyApi } from "@infrastructure/api/properties.api";

// Mocks de dependencias
vi.mock("@infrastructure/api/properties.api", () => ({
  propertyApi: {
    create: vi.fn(),
  },
}));

vi.mock("@infrastructure/api/caracteristicas.api", () => ({
  caracteristicasApi: {
    guardarCaracteristicasPropiedad: vi.fn(),
  },
}));

describe("propertyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPropertyConCaracteristicas", () => {
    const validPropertyInput = {
      titulo: "Casa de prueba",
      direccion: "Calle 123",
      ciudad: "Bogotá",
      departamento: "Cundinamarca",
      tipoOperacion: "venta",
      precio: 1000000,
      area: 80,
      habitaciones: 3,
      banos: 2,
      estrato: 3,
      idusuario: 1,
      descripcion: null,
      tipoPropiedad: null,
      antiguedad: null,
      barrio: null,
      codigopostal: null
    };

    it("debería lanzar error si falta el título", async () => {
      await expect(
        propertyService.createPropertyConCaracteristicas({ ...validPropertyInput, titulo: "" }, [])
      ).rejects.toThrow("El título es obligatorio.");
    });

    it("debería lanzar error si el precio es <= 0", async () => {
      await expect(
        propertyService.createPropertyConCaracteristicas({ ...validPropertyInput, precio: 0 }, [])
      ).rejects.toThrow("El precio debe ser un valor válido y mayor a 0.");
    });

    it("debería lanzar error si el área es <= 0", async () => {
      await expect(
        propertyService.createPropertyConCaracteristicas({ ...validPropertyInput, area: -10 }, [])
      ).rejects.toThrow("El área debe ser un valor válido y mayor a 0.");
    });

    it("debería crear la propiedad y guardar características si el input es válido", async () => {
        const mockNueva = { idpropiedad: 10, ...validPropertyInput } as any;
        vi.mocked(propertyApi.create).mockResolvedValue(mockNueva);

        const result = await propertyService.createPropertyConCaracteristicas(validPropertyInput, [1, 2]);

        expect(propertyApi.create).toHaveBeenCalledWith(validPropertyInput, false);
        expect(result.idpropiedad).toBe(10);
    });
  });
});
