import { useState } from "react";
import AdminPropertiesTab from "./components/AdminPropertiesTab";
import AdminUsersTab from "./components/AdminUsersTab";
import "./AdminPage.css";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"usuarios" | "reportes" | "auditoria" | "propiedades">("propiedades");

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Aprobación y rechazo de publicaciones de propiedades pendientes.</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "usuarios" ? "active" : ""}`}
          onClick={() => setActiveTab("usuarios")}
        >
          Usuarios
        </button>
        <button
          className={`admin-tab ${activeTab === "propiedades" ? "active" : ""}`}
          onClick={() => setActiveTab("propiedades")}
        >
          Propiedades en Revisión
        </button>
        <button
          className={`admin-tab ${activeTab === "reportes" ? "active" : ""}`}
          onClick={() => setActiveTab("reportes")}
        >
          Reportes
        </button>
        <button
          className={`admin-tab ${activeTab === "auditoria" ? "active" : ""}`}
          onClick={() => setActiveTab("auditoria")}
        >
          Auditoría
        </button>
      </div>

      <div className="admin-content" style={{ marginTop: "20px" }}>
        {activeTab === "usuarios" && <AdminUsersTab />}

        {activeTab === "propiedades" && <AdminPropertiesTab />}

        {activeTab === "reportes" && (
          <div className="admin-tab-content">
            <h2>Gestión de reportes</h2>
            <p>Revisa y gestiona reportes de propiedades.</p>
            <div className="admin-empty-state" style={{marginTop:"30px", border:"1px dashed #e5e7eb", padding:"40px", color:"#aaa", borderRadius:"12px"}}>No hay reportes.</div>
          </div>
        )}

        {activeTab === "auditoria" && (
          <div className="admin-tab-content">
            <h2>Logs de auditoría</h2>
            <p>Registro de todas las acciones del sistema.</p>
            <div className="admin-empty-state" style={{marginTop:"30px", border:"1px dashed #e5e7eb", padding:"40px", color:"#aaa", borderRadius:"12px"}}>No hay logs de auditoría.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
