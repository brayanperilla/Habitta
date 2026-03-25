import "./modal.css";
import { type FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Notificacion } from "@infrastructure/api/notificaciones.api";

interface ModalNProps {
  isOpen: boolean;
  onClose: () => void;
  notificaciones: Notificacion[];
  noLeidasCount: number;
  onMarcarTodasLeidas: () => void;
}

const TIPO_ICON: Record<string, string> = {
  propiedad_publicada: "🏠",
  estado_propiedad: "📋",
  nueva_coincidencia: "🔍",
  mensaje: "💬",
  cuenta: "🔒",
  favorito: "❤️",
};

function formatRelativo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  return `Hace ${Math.floor(hrs / 24)} días`;
}

const ModalN: FC<ModalNProps> = ({
  isOpen,
  onClose,
  notificaciones,
  noLeidasCount,
  onMarcarTodasLeidas,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // IDs descartados localmente del modal — persisten al recargar usando localStorage
  const [dismissed, setDismissed] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem("habitta_dismissed_notifications");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const btn = document.getElementById("notificationButton");
      if (btn && btn.contains(e.target as Node)) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Limpiar descartadas cuando el modal se abre de nuevo
  useEffect(() => {
    if (isOpen) {
      // Marcar todas como leídas → borra el badge
      if (noLeidasCount > 0) onMarcarTodasLeidas();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render persistente para animación de salida

  const handleVerTodas = () => {
    onClose();
    navigate("/notification");
  };

  // Excluir las descartadas localmente y mostrar max 5
  const visibles = notificaciones
    .filter((n) => !dismissed.has(n.idnotificacion))
    .slice(0, 5);

  const handleDismiss = (id: number) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("habitta_dismissed_notifications", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <div className={`modal-content modal-animated ${isOpen ? "open" : ""}`} ref={modalRef}>
      <header className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className="modal-title">Notificaciones</h2>
        {notificaciones.length > 0 && (
          <button
            onClick={handleVerTodas}
            style={{
              background: "none",
              border: "none",
              color: "#35d2db",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontWeight: 600,
              padding: "4px 8px",
            }}
          >
            Ver todas →
          </button>
        )}
      </header>

      <section className="modal-body">
        {visibles.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", padding: "2rem", fontSize: "0.9rem" }}>
            No tienes notificaciones nuevas.
          </p>
        )}

        <div className="notifications-list">
          {visibles.map((n) => (
            <div
              key={n.idnotificacion}
              className="notification-card"
              style={{
                background: n.leido ? "#fafafa" : "#f0fbfc",
                borderLeft: n.leido ? "4px solid #ddd" : "4px solid #35d2db",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <h3 className="notification-title" style={{ fontSize: "0.9rem" }}>
                    {TIPO_ICON[n.tipo] ?? "🔔"} {n.titulo}
                  </h3>
                  {n.descripcion && (
                    <p className="notification-description" style={{ fontSize: "0.82rem" }}>
                      {n.descripcion}
                    </p>
                  )}
                  <p className="notification-time">{formatRelativo(n.fechaEnvio)}</p>
                </div>
                {/* × = solo oculta del modal persistentemente (no borra del DB, sigue en /notification) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(n.idnotificacion);
                  }}
                  title="Ocultar notificación de este panel"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ccc",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    padding: "0 4px",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ModalN;
