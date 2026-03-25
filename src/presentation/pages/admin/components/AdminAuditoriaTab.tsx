import { useState, useEffect } from "react";
import { supabase } from "@infrastructure/supabase/client";
import { useToast } from "@application/context/ToastContext";

interface AuditoriaLog {
  idauditoria: number;
  fecha: string;
  tipo: string;
  entidad: string;
  identidad: number;
  detalle: string;
  idusuario: number | null;
  usuarios?: {
    nombre: string;
  } | null;
}

export default function AdminAuditoriaTab() {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('auditorias')
        .select(`*, usuarios(nombre)`)
        .order('fecha', { ascending: false })
        .limit(100);

      if (error) throw new Error(error.message);
      setLogs(data || []);
    } catch (err: any) {
      showToast(err.message || "Error al cargar el registro de auditoría", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="admin-tab-content">
        <h2>Logs de Auditoría</h2>
        <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
          Cargando registros...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tab-content">
      <h2>Logs de Auditoría</h2>
      <p>Registro ordenado cronológicamente de todas las acciones importantes del sistema.</p>

      {logs.length === 0 ? (
        <div className="admin-empty-state" style={{ marginTop: "30px", border: "1px dashed #e5e7eb", padding: "40px", color: "#aaa", borderRadius: "12px", textAlign: "center" }}>
          No hay registros de auditoría aún.
        </div>
      ) : (
        <div className="admin-table-container" style={{ marginTop: "20px" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Entidad Afectada</th>
                <th>Descripción Detallada</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.idauditoria}>
                  <td style={{ whiteSpace: "nowrap", fontSize: "0.85rem", color: "#4b5563" }}>
                    {new Date(log.fecha).toLocaleString('es-CO', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        textTransform: "uppercase"
                      }}
                    >
                      {log.tipo}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    {log.entidad} <span style={{ fontWeight: 600 }}>#{log.identidad}</span>
                  </td>
                  <td style={{ fontSize: "0.9rem", color: "#111827", lineHeight: "1.4" }}>
                    {log.detalle}
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
