import { useState } from "react";
import AdminPropertiesTab from "./components/AdminPropertiesTab";
import AdminUsersTab from "./components/AdminUsersTab";
import AdminReportsTab from "./components/AdminReportsTab";
import AdminPqrsTab from "./components/AdminPqrsTab";
import AdminAuditoriaTab from "./components/AdminAuditoriaTab";
import "./AdminPage.css";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"usuarios" | "reportes" | "auditoria" | "propiedades" | "pqrs">("propiedades");

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
          className={`admin-tab ${activeTab === "pqrs" ? "active" : ""}`}
          onClick={() => setActiveTab("pqrs")}
        >
          PQRS
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

        {activeTab === "reportes" && <AdminReportsTab />}

        {activeTab === "pqrs" && <AdminPqrsTab />}

        {activeTab === "auditoria" && <AdminAuditoriaTab />}
      </div>
    </div>
  );
}

export default AdminPage;
