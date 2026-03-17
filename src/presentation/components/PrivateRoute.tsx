import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { useToast } from "@application/context/ToastContext";

/**
 * Envuelve rutas que requieren autenticación.
 * Si el usuario no está autenticado y la sesión ya se cargó,
 * redirige a /auth usando `replace` para que el botón "Atrás"
 * no vuelva a la página protegida.
 */
const PrivateRoute = () => {
  const { usuario, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (usuario) {
      const estado = (usuario.estadocuenta || "").trim().toLowerCase();
      if (estado === "eliminada" || estado === "suspendida") {
        signOut().then(() => {
          showToast(`Tu cuenta ha sido ${estado}. Has sido desconectado.`, "error");
          navigate("/auth", { replace: true });
        });
      }
    }
  }, [usuario, signOut, navigate, showToast]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ color: "#aaa", fontSize: "1rem" }}>Cargando...</p>
      </div>
    );
  }

  return usuario ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
