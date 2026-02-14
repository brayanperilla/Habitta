import "./notification.css";
import { type FC } from "react";

interface NotificationItem {
  id: number;
  title: string;
  date: string;
  body: string;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Nueva propiedad disponible",
    date: "13 de octubre de 2025, 09:12",
    body: "Se ha publicado un apartamento de 2 habitaciones en el barrio Chapinero, Bogotá. Esta propiedad cumple con los criterios que has guardado en tus búsquedas favoritas",
  },
  {
    id: 2,
    title: "Nueva propiedad disponible",
    date: "13 de octubre de 2025, 09:12",
    body: "Se ha publicado un apartamento de 2 habitaciones en el barrio Chapinero, Bogotá. Esta propiedad cumple con los criterios que has guardado en tus búsquedas favoritas",
  },
  {
    id: 3,
    title: "Nueva propiedad disponible",
    date: "13 de octubre de 2025, 09:12",
    body: "Se ha publicado un apartamento de 2 habitaciones en el barrio Chapinero, Bogotá. Esta propiedad cumple con los criterios que has guardado en tus búsquedas favoritas",
  },
];

const Notification: FC = () => {
  return (
    <div className="notification-page">
      <h1 className="notification-title">Notificaciones</h1>

      <nav className="notification-tabs" aria-label="Filtrar notificaciones">
        <button className="tab tab--active">Todas (3)</button>
        <button className="tab">Sin leer (3)</button>
      </nav>

      <section className="notification-content">
        {notifications.map((n) => (
          <article key={n.id} className="notification-card" role="article" aria-label={n.title}>
            <div className="notification-card__actions" role="group" aria-label="acciones de notificación">
              <button className="icon-btn mark-read" aria-label="Marcar como leído">✓</button>
              <button className="icon-btn delete" aria-label="Eliminar notificación">🗑</button>
            </div>

            <div className="notification-card__content">
              <div className="notification-card__header">
                <h3 className="notification-card__title">
                  {n.title}
                  <span className="notification-dot" aria-hidden="true" />
                </h3>
                <time className="notification-card__date">{n.date}</time>
              </div>

              <p className="notification-card__text">{n.body}</p>

              <button className="btn btn--orange" aria-label={`Ver detalles de ${n.title}`}>
                Ver detalles
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Notification;