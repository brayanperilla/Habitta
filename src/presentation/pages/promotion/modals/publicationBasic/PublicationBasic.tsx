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
