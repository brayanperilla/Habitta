import {} from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import "./Layout.css";
import { useAuth } from "@application/context/AuthContext";

// Layout Component
export default function Layout() {
  const location = useLocation();
  const { usuario, loading } = useAuth();
  const isAuthPage = location.pathname === "/auth";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminRole = usuario?.rol === "admin";
  const hideLayout = isAuthPage || isAdminPage || isAdminRole;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        {/* Loader para evitar destellos (flicker) de UI antes del redirect al validar la sesión */}
      </div>
    );
  }

  // Redirigir agresivamente al Admin si intenta entrar al Home
  if (isAdminRole && location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {!isAuthPage && <Navbar />}

      {/* Main Content */}
      <main style={{ width: "100%", boxSizing: "border-box" }}>
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}
