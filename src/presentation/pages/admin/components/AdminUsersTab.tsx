import { useState, useEffect } from "react";
import { usuariosApi } from "@infrastructure/api/usuarios.api";
import { useToast } from "@application/context/ToastContext";
import type { Usuario } from "@domain/entities/Usuario";

export default function AdminUsersTab() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosApi.getAllUsuarios();
      setUsuarios(data);
    } catch (error: any) {
      showToast(error.message || "No se pudieron cargar los usuarios.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCambiarPlan = async (usuario: Usuario) => {
    try {
      const planActual = usuario.plan || "gratuito";
      const nuevoPlan = planActual === "gratuito" ? "premium" : "gratuito";
      await usuariosApi.cambiarPlan(usuario.idusuario, nuevoPlan);
      
      showToast(`Plan cambiado a ${nuevoPlan} para ${usuario.nombre}.`, "success");
      
      cargarUsuarios(); // Recargar datos
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleCambiarEstado = async (usuario: Usuario) => {
    try {
      // Toggle considerando que valores vacíos/null significan "Activa"
      const estadoActual = usuario.estadocuenta || "Activa";
      const nuevoEstado = estadoActual === "Activa" ? "Suspendida" : "Activa";
      await usuariosApi.updateUserState(usuario.idusuario, nuevoEstado);
      
      showToast(`La cuenta de ${usuario.nombre} ahora está ${nuevoEstado}.`, "success");
      
      cargarUsuarios();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="admin-tab-content">
        <h2>Gestión de usuarios</h2>
        <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
          Cargando usuarios...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tab-content">
      <h2>Gestión de usuarios</h2>
      <p>Administra perfiles de usuario, estados de cuenta y roles.</p>

      {usuarios.length === 0 ? (
        <div className="admin-empty-state" style={{ marginTop: "30px", border: "1px dashed #e5e7eb", padding: "40px", color: "#aaa", borderRadius: "12px", textAlign: "center" }}>
          No hay usuarios registrados en la plataforma.
        </div>
      ) : (
        <div className="admin-table-container" style={{ marginTop: "20px" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Contacto</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Última Actividad</th>
                <th>Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.idusuario}>
                  <td>
                    <div style={{ fontWeight: 500, color: "#111827" }}>{user.nombre}</div>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>ID: {user.idusuario}</div>
                    {user.rol === "admin" && (
                       <span style={{ fontSize: "0.75rem", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", marginTop: "4px", display: "inline-block" }}>Admin</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: "0.9rem" }}>{user.correo}</div>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>{user.telefono || "Sin teléfono"}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.80rem",
                        fontWeight: 500,
                        backgroundColor: user.plan === "premium" ? "#fdf6b2" : "#f3f4f6",
                        color: user.plan === "premium" ? "#9f580a" : "#4b5563",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.80rem",
                        fontWeight: 500,
                        backgroundColor: user.estadocuenta === "Activa" ? "#d1fae5" : "#fee2e2",
                        color: user.estadocuenta === "Activa" ? "#065f46" : "#991b1b",
                      }}
                    >
                      {user.estadocuenta || "Activa"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    {user.ultimaactividad 
                        ? new Date(user.ultimaactividad).toLocaleDateString() 
                        : "Nunca"}
                  </td>
                  <td>
                    <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
                      {user.rol !== "admin" && (
                        <>
                          <button
                            onClick={() => handleCambiarPlan(user)}
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.80rem",
                              fontWeight: 500,
                              borderRadius: "6px",
                              border: "1px solid",
                              cursor: "pointer",
                              width: "115px",
                              transition: "all 0.2s",
                              backgroundColor: user.plan === "premium" ? "#fff" : "#14b8a6",
                              color: user.plan === "premium" ? "#4b5563" : "#fff",
                              borderColor: user.plan === "premium" ? "#d1d5db" : "#14b8a6",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
                            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                          >
                            {user.plan === "premium" ? "Bajar a Gratis" : "Hacer Premium"}
                          </button>
                          
                          <button
                            onClick={() => handleCambiarEstado(user)}
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.80rem",
                              fontWeight: 500,
                              borderRadius: "6px",
                              border: "1px solid",
                              cursor: "pointer",
                              width: "100px",
                              transition: "all 0.2s",
                              backgroundColor: user.estadocuenta === "Activa" ? "#fff" : "#ef4444",
                              color: user.estadocuenta === "Activa" ? "#ef4444" : "#fff",
                              borderColor: user.estadocuenta === "Activa" ? "#fca5a5" : "#ef4444",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
                            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                          >
                            {user.estadocuenta === "Activa" ? "Suspender" : "Reactivar"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
