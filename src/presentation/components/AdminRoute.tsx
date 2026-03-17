import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";

/**
 * Solo permite el acceso a usuarios con rol "admin".
 * Si no es admin, redirige al inicio ("/").
 */
const AdminRoute = () => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ color: "#aaa", fontSize: "1rem" }}>Cargando administrador...</p>
      </div>
    );
  }

  return usuario?.rol === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
