import React, { type FC } from "react";
import "./publicationOutstanding.css";

interface PublicationOutstandingProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish?: () => void;
}

const PublicationOutstanding: FC<PublicationOutstandingProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="outstanding-modal-overlay" onClick={handleOverlayClick}>
      <div className="outstanding-modal-content">
        <div className="outstanding-modal-header">
          <div className="plan-icon-container" style={{ margin: "0 auto 1rem auto", width: "70px", height: "70px", backgroundColor: "#EDFDFA", padding: "10px" }}>
            <svg
              className="plan-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "40px", height: "40px" }}
            >
              <path
                d="M13 2L6 12H11L10 22L18 11H13L14 2.5"
                stroke="#20D4BF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="outstanding-modal-title">Completar promoción</h2>
          <p className="outstanding-modal-subtitle">
            Selecciona la propiedad y método de pago
          </p>
        </div>

        <div className="outstanding-modal-body">
          <div className="form-group">
            <label className="form-label">Propiedad</label>
            <select className="form-input">
              <option disabled selected>
                Seleccione su Propiedad
              </option>
              {/* Cargar propiedades disponibles aquí */}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Método de pago</label>
            <input className="form-input" defaultValue="Transferencia Bancaria" />
          </div>

          <div className="summary-box">
            <div className="summary-row">
              <span className="summary-label">Plan:</span>
              <span>Publicación destacada</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Duración:</span>
              <span>30 días</span>
            </div>
            <div className="summary-row" style={{ marginTop: "15px" }}>
              <span className="summary-label">Total:</span>
              <span>$199</span>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-publish" onClick={onPublish}>
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationOutstanding;

