import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@application/context/AuthContext";
import App from "../App";

/**
 * Test de ejemplo para verificar que Vitest funciona correctamente.
 * Renderiza el componente App dentro de los proveedores necesarios.
 */
describe("App", () => {
  // Verifica que el componente App se renderiza sin errores
  it("debería renderizar sin errores", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );

    // Si llega aquí sin errores, el componente se renderizó correctamente
    expect(document.body).toBeTruthy();
  });
});
