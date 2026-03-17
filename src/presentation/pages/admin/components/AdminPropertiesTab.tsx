import { useEffect, useState } from "react";
import { propertyService } from "@application/services/propertyService";
import type { Property } from "@domain/entities/Property";
import { useToast } from "@application/context/ToastContext";
// Supabase para poder hacer el join con los nombres de usuarios
import { supabase } from "@infrastructure/supabase/client";

// Tipo extendido para la tabla de Admin
type PendingProperty = Property & {
  usuarios?: {
    nombre: string;
    telefono: string | null;
  } | null;
};

function AdminPropertiesTab() {
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPendingProperties = async () => {
    setLoading(true);
    try {
      // Hacemos el fetch directamente aquí para aprovechar el join con 'usuarios'
      const { data, error } = await supabase
        .from("propiedades")
        .select(`*, fotospropiedad(url, orden), usuarios!inner(nombre, telefono)`)
        .or("estadoPublicacion.eq.pending_manual,estadoPublicacion.ilike.pendiente,estadoPublicacion.is.null")
        .order("fechacreacion", { ascending: false });

      if (error) throw new Error(error.message);

      // Mapeamos para que la fotoUrl quede expuesta
      const mapped = (data || []).map((p: any) => {
        let fotoUrl = null;
        if (p.fotospropiedad && p.fotospropiedad.length > 0) {
          const fotos = [...p.fotospropiedad].sort(
            (a, b) => (a.orden || 0) - (b.orden || 0),
          );
          fotoUrl = fotos[0].url;
        }
        return {
          ...p,
          fotoUrl,
        } as PendingProperty;
      });

      setProperties(mapped);
    } catch (err: any) {
      showToast(err.message || "Error al obtener propiedades pendientes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const handleUpdateStatus = async (id: number, status: "activa" | "rechazada") => {
    if (!window.confirm(`¿Estás seguro de que quieres ${status === "activa" ? "aprobar" : "rechazar"} esta propiedad?`)) return;

    try {
      await propertyService.updateProperty(id, { estadoPublicacion: status });
      showToast(`Propiedad ${status === "activa" ? "aprobada" : "rechazada"} con éxito`, "success");
      setProperties((prev) => prev.filter((p) => p.idpropiedad !== id));
    } catch (err: any) {
      showToast(err.message || "Error al actualizar la propiedad", "error");
    }
  };

  if (loading) {
    return <div className="admin-tab-content">Cargando propiedades...</div>;
  }

  return (
    <div className="admin-tab-content">
      <h2>Gestión de Propiedades</h2>
      <p>Revisa y aprueba propiedades creadas por los usuarios antes de que sean públicas.</p>

      {properties.length === 0 ? (
        <div className="admin-empty-state">No hay propiedades pendientes de revisión.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Propietario</th>
                <th>Contacto</th>
                <th>Título de Propiedad</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.idpropiedad}>
                  <td>{prop.usuarios?.nombre || "Usuario Desconocido"}</td>
                  <td>{prop.usuarios?.telefono || "N/A"}</td>
                  <td className="admin-td-title">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {prop.fotoUrl ? (
                        <img
                          src={prop.fotoUrl}
                          alt="Miniatura"
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                        />
                      ) : (
                        <div style={{ width: "40px", height: "40px", background: "#eee", borderRadius: "6px" }} />
                      )}
                      <a href={`/propertydetailspage/${prop.idpropiedad}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3498db" }}>
                        {prop.titulo || "Sin título"}
                      </a>
                    </div>
                  </td>
                  <td>{new Date(prop.fechacreacion || "").toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn-approve"
                        onClick={() => handleUpdateStatus(prop.idpropiedad, "activa")}
                      >
                        Aprobar
                      </button>
                      <button
                        className="admin-btn-reject"
                        onClick={() => handleUpdateStatus(prop.idpropiedad, "rechazada")}
                      >
                        Rechazar
                      </button>
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

export default AdminPropertiesTab;
