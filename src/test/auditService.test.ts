import { describe, it, expect, vi, beforeEach } from "vitest";
import { auditService } from "@application/services/auditService";
import { supabase } from "@infrastructure/supabase/client";

// Mock de Supabase
vi.mock("@infrastructure/supabase/client", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe("auditService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería llamar al RPC 'insert_auditoria' con los parámetros correctos", async () => {
    // Configurar el mock para que devuelva éxito
    const mockRpc = vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: null,
    } as any);

    const testData = {
      tipo: "test_action",
      entidad: "test_entity",
      identidad: 123,
      detalle: "Test details",
      idusuario: 456,
    };

    await auditService.logAction(
      testData.tipo,
      testData.entidad,
      testData.identidad,
      testData.detalle,
      testData.idusuario
    );

    // Verificar que se llamó al RPC correcto con los prefijos p_
    expect(mockRpc).toHaveBeenCalledWith("insert_auditoria", {
      p_tipo: testData.tipo,
      p_entidad: testData.entidad,
      p_identidad: testData.identidad,
      p_detalle: testData.detalle,
      p_idusuario: testData.idusuario,
    });
  });

  it("debería manejar errores de Supabase sin lanzar excepciones", async () => {
    // Configurar el mock para que devuelva un error
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: { message: "Database Error" },
    } as any);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await auditService.logAction("tipo", "entidad", 1, "detalle", 1);

    // No debería fallar el método, pero sí loguear el error en consola
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al registrar auditoría:",
      "Database Error"
    );
    
    consoleSpy.mockRestore();
  });
});
