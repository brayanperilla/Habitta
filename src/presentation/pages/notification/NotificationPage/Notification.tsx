import "./notification.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { notificacionesApi, type Notificacion } from "@infrastructure/api/notificaciones.api";

const TIPO_ICONS: Record<string, string> = {
  propiedad_publicada: "🏠",
  estado_propiedad: "📋",
  nueva_coincidencia: "🔍",
  favorito: "❤️",
  cuenta: "🔒",
  mensaje: "💬",
};

function formatFecha(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-CO", {
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
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.idnotificacion === notif.idnotificacion ? { ...n, leido: nuevo } : n
      )
    );
    try {
      await notificacionesApi.toggleLeida(notif.idnotificacion, nuevo);
    } catch {
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
    } catch {
      cargar();
    }
  };

  const mostradas =
    tab === "sinleer"
      ? notificaciones.filter((n) => !n.leido)
      : notificaciones;

  const noLeidasCount = notificaciones.filter((n) => !n.leido).length;

  const getActionLink = (n: Notificacion) => {
    switch (n.tipo) {
      case "estado_propiedad":
        return { label: "Ver mis propiedades", path: "/mypanel" };
      case "propiedad_publicada":
      case "nueva_coincidencia":
        return { label: "Ver propiedades", path: "/properties" };
      case "favorito":
        return { label: "Ver mis propiedades", path: "/mypanel" };
      default:
        return null;
    }
  };

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

      {/* Tabs tipo segmento */}
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
            {tab === "sinleer"
              ? "No tienes notificaciones sin leer."
              : "No tienes notificaciones."}
          </p>
        )}

        {mostradas.map((n) => {
          const actionLink = getActionLink(n);
          return (
            <article
              key={n.idnotificacion}
              className={`notification-card${n.leido ? "" : " notification-card--unread"}`}
              role="article"
              aria-label={n.titulo}
            >
              {/* Header: título + fecha | botones de acción */}
              <div className="notification-card__header">
                <div className="notification-card__meta">
                  <h3 className="notification-card__title">
                    <span className="notif-tipo-icon">
                      {TIPO_ICONS[n.tipo] ?? "🔔"}
                    </span>
                    {n.titulo}
                    {!n.leido && <span className="notification-dot" aria-hidden="true" />}
                  </h3>
                  <time className="notification-card__date">{formatFecha(n.fechaEnvio)}</time>
                </div>

                {/* Botones naranjas cuadrados (Figma) */}
                <div className="notification-card__actions" role="group" aria-label="Acciones">
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
                    title="Eliminar"
                    onClick={() => handleEliminar(n.idnotificacion)}
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Cuerpo */}
              {n.descripcion && (
                <p className="notification-card__text">{n.descripcion}</p>
              )}

              {/* Botón de acción */}
              {actionLink && (
                <button
                  className="btn btn--orange"
                  onClick={() => navigate(actionLink.path)}
                >
                  {actionLink.label}
                </button>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Notification;