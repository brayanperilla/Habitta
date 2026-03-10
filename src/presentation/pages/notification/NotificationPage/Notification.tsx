import "./notification.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { notificacionesApi, type Notificacion } from "@infrastructure/api/notificaciones.api";

const TIPO_ICONS: Record<string, string> = {
  propiedad_publicada: "🏠",
  estado_propiedad: "📋",
  nueva_coincidencia: "🔍",
};

const TIPO_LABELS: Record<string, string> = {
  propiedad_publicada: "Propiedad publicada",
  estado_propiedad: "Estado de propiedad",
  nueva_coincidencia: "Nueva coincidencia",
};

function formatFecha(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Notification = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"todas" | "sinleer">("todas");

  const cargar = useCallback(async () => {
    if (!usuario?.idusuario) return;
    try {
      const data = await notificacionesApi.getByUsuario(usuario.idusuario);
      setNotificaciones(data);
      // Auto-marcar como leídas al abrir la página
      const noLeidas = data.filter((n) => !n.leido);
      if (noLeidas.length > 0) {
        await notificacionesApi.marcarTodasLeidas(usuario.idusuario);
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
      }
    } catch (e) {
      console.error("Error cargando notificaciones:", e);
    } finally {
      setLoading(false);
    }
  }, [usuario?.idusuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleToggleLeida = async (notif: Notificacion) => {
    const nuevo = !notif.leido;
    // Actualizar estado local inmediatamente
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.idnotificacion === notif.idnotificacion ? { ...n, leido: nuevo } : n
      )
    );
    try {
      await notificacionesApi.toggleLeida(notif.idnotificacion, nuevo);
    } catch {
      // Revertir si falla
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.idnotificacion === notif.idnotificacion ? { ...n, leido: !nuevo } : n
        )
      );
    }
  };

  const handleEliminar = async (id: number) => {
    setNotificaciones((prev) => prev.filter((n) => n.idnotificacion !== id));
    try {
      await notificacionesApi.eliminar(id);
    } catch (e) {
      console.error("Error eliminando notificación:", e);
      cargar(); // Recargar si falla
    }
  };

  const mostradas =
    tab === "sinleer"
      ? notificaciones.filter((n) => !n.leido)
      : notificaciones;

  const noLeidasCount = notificaciones.filter((n) => !n.leido).length;

  if (!usuario) {
    return (
      <div className="notification-page">
        <h1 className="notification-title">Notificaciones</h1>
        <p style={{ textAlign: "center", color: "#aaa", padding: "3rem" }}>
          Inicia sesión para ver tus notificaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="notification-page">
      <h1 className="notification-title">Notificaciones</h1>

      <nav className="notification-tabs" aria-label="Filtrar notificaciones">
        <button
          className={`tab${tab === "todas" ? " tab--active" : ""}`}
          onClick={() => setTab("todas")}
        >
          Todas ({notificaciones.length})
        </button>
        <button
          className={`tab${tab === "sinleer" ? " tab--active" : ""}`}
          onClick={() => setTab("sinleer")}
        >
          Sin leer ({noLeidasCount})
        </button>
      </nav>

      <section className="notification-content">
        {loading && (
          <p style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
            Cargando notificaciones...
          </p>
        )}

        {!loading && mostradas.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
            {tab === "sinleer" ? "No tienes notificaciones sin leer." : "No tienes notificaciones."}
          </p>
        )}

        {mostradas.map((n) => (
          <article
            key={n.idnotificacion}
            className={`notification-card${n.leido ? "" : " notification-card--unread"}`}
            role="article"
            aria-label={n.titulo}
          >
            <div className="notification-card__actions" role="group" aria-label="acciones de notificación">
              <button
                className={`icon-btn mark-read${n.leido ? " is-read" : ""}`}
                aria-label={n.leido ? "Marcar como no leído" : "Marcar como leído"}
                title={n.leido ? "Marcar como no leído" : "Marcar como leído"}
                onClick={() => handleToggleLeida(n)}
              >
                {n.leido ? "↩" : "✓"}
              </button>
              <button
                className="icon-btn delete"
                aria-label="Eliminar notificación"
                onClick={() => handleEliminar(n.idnotificacion)}
              >
                🗑
              </button>
            </div>

            <div className="notification-card__content">
              <div className="notification-card__header">
                <h3 className="notification-card__title">
                  <span className="notif-tipo-icon">
                    {TIPO_ICONS[n.tipo] ?? "🔔"}
                  </span>
                  {n.titulo}
                  {!n.leido && <span className="notification-dot" aria-hidden="true" />}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <time className="notification-card__date">{formatFecha(n.fechaEnvio)}</time>
                  {n.tipo && (
                    <span className="notif-tipo-badge">
                      {TIPO_LABELS[n.tipo] ?? n.tipo}
                    </span>
                  )}
                </div>
              </div>

              {n.descripcion && (
                <p className="notification-card__text">{n.descripcion}</p>
              )}

              {n.tipo === "estado_propiedad" && (
                <button
                  className="btn btn--orange"
                  onClick={() => navigate("/my-panel")}
                  aria-label="Ver mis propiedades"
                >
                  Ver mis propiedades
                </button>
              )}
              {n.tipo === "propiedad_publicada" && (
                <button
                  className="btn btn--orange"
                  onClick={() => navigate("/properties")}
                  aria-label="Ver propiedades"
                >
                  Ver propiedades
                </button>
              )}
              {n.tipo === "nueva_coincidencia" && (
                <button
                  className="btn btn--orange"
                  onClick={() => navigate("/properties")}
                  aria-label="Ver coincidencias"
                >
                  Ver coincidencias
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Notification;