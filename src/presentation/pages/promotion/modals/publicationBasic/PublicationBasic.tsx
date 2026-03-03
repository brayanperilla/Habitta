import React, { type FC } from "react";
import "./publicationBasic.css";

interface PublicationBasicProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish?: () => void;
}

const PublicationBasic: FC<PublicationBasicProps> = ({ isOpen, onClose, onPublish }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="basic-modal-overlay" onClick={handleOverlayClick}>
      <div className="basic-modal-content">
        <div className="basic-modal-header">
          <div className="plan-icon-container" style={{ margin: "0 auto 1rem auto", width: "70px", height: "70px", backgroundColor: "#E6F9F8", padding: "12px" }}>
            <svg
              className="plan-icon"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 20 C52 40 60 48 80 50 C60 52 52 60 50 80 C48 60 40 52 20 50 C40 48 48 40 50 20 Z"
                fill="none"
                stroke="#00C4B4"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M70 25 L82 25 M76 19 L76 31"
                fill="none"
                stroke="#00C4B4"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle
                cx="28"
                cy="72"
                r="4.5"
                fill="none"
                stroke="#00C4B4"
                strokeWidth="5"
              />
            </svg>
          </div>
          <h2 className="basic-modal-title">Publicación Básica</h2>
          <p className="basic-modal-subtitle">
            Seleccione la propiedad y método de pago
          </p>
        </div>

        <div className="basic-modal-body">
          <div className="form-group">
            <label className="form-label">Propiedad</label>
            <select className="form-input">
              <option disabled selected>
                Seleccione su Propiedad
              </option>
              {/* Aquí se cargarían las propiedades reales */}
            </select>
          </div>

          <div className="summary-box">
            <div className="summary-row">
              <span className="summary-label">Plan:</span>
              <span>Publicación Básica</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Duración:</span>
              <span>30 días</span>
            </div>
            <div className="summary-row" style={{ marginTop: "15px" }}>
              <span className="summary-label">Total:</span>
              <span>$0</span>
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

export default PublicationBasic;
