import "./modal.css";
import React, { type FC } from "react";
import { useNavigate } from "react-router-dom";

interface ModalNProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "property" | "message" | "promotion";
}

const ModalN: FC<ModalNProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewAll = () => {
    onClose();
    navigate("/Notification");
  };

  const notifications: Notification[] = [
    {
      id: 1,
      title: "Nueva Propiedad disponible",
      description: "se ha publicado una nueva propiedad que coincide con tus búsquedas",
      time: "Hace 29 minutos",
      type: "property",
    },

    {
      id: 2,
      title: "Mensaje Recibido",
      description: "tienes un nueva mensaje sobre tu propiedad",
      time: "Hace 1 horas",
      type: "message",
    },
  ];

  const getNotificationTypeClass = (type: string) => {
    switch (type) {
      case "property":
        return "notification-card--property";
      case "message":
        return "notification-card--message";
      default:
        return "";
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <header className="modal-header">
          <h2 className="modal-title">Notificaciones</h2>
        </header>

        <section className="modal-body">
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-card ${getNotificationTypeClass(notif.type)}`}
              >
                <h3 className="notification-title">{notif.title}</h3>
                <p className="notification-description">{notif.description}</p>
                <p className="notification-time">{notif.time}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="modal-footer">
          <button className="modal-view-all-btn" onClick={handleViewAll}>
            Ver todas las notificaciones
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalN;
