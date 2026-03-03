import "../promotion/promotion.css";
import { useState } from "react";
import PublicationBasic from "./modals/publicationBasic/PublicationBasic";
import PublicationOutstanding from "./modals/publicationOutstanding/PublicationOutstanding";
import { useToast } from "@application/context/ToastContext";

// Componente de Promoción
function Promotion() {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isOutstandingModalOpen, setIsOutstandingModalOpen] = useState(false);
  const { showToast } = useToast();

  const openBasicModal = () => setIsBasicModalOpen(true);
  const closeBasicModal = () => setIsBasicModalOpen(false);

  const openOutstandingModal = () => setIsOutstandingModalOpen(true);
  const closeOutstandingModal = () => setIsOutstandingModalOpen(false);

  const handlePublishSuccess = () => {
    showToast("Propiedad publicada exitosamente", "success");
    setIsBasicModalOpen(false);
    setIsOutstandingModalOpen(false);
  };

  return (
    <div className="promotion-container">
      <h1 className="promotion-title">Planes de Publicación</h1>
      <p className="promotion-subtitle">
        Aumenta la visibilidad de tu propiedad
      </p>

      <div className="promotion-cards">
        {/* Plan Básico */}
        <div className="promotion-card basic">
          <div className="plan-icon-container">
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
          <h2>Publicación Básica</h2>
          <p className="card-subtitle">Publicación estándar de tu propiedad</p>
          <p className="price">$0</p>
          <p className="price-label">Por 30 días</p>
          <ul className="feature-list">
            <li>
              <span className="check basic">✔</span> Publicación por 30 días
            </li>
            <li>
              <span className="check basic">✔</span> Hasta 7 fotos
            </li>
            <li>
              <span className="check basic">✔</span> Aparece en búsquedas
            </li>
          </ul>
          <button className="select-button orange" onClick={openBasicModal}>
            Seleccionar Plan
          </button>
        </div>

        {/* Plan Destacado */}
        <div className="promotion-card featured">
          <div className="plan-icon-container" style={{ backgroundColor: "#EDFDFA" }}>
            <svg
              className="plan-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "50px", height: "50px" }}
            >
              <path
                d="M13 2L6 12H11L10 22L18 11H13L14 2.5"
                stroke="#20D4BF"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Publicación Destacada</h2>
          <p className="card-subtitle">
            Tu propiedad destacada en los resultados
          </p>
          <p className="price">$199</p>
          <p className="price-label">Por 30 días</p>
          <ul className="feature-list">
            <li>
              <span className="check featured">✔</span> Publicación por 30 días
            </li>
            <li>
              <span className="check featured">✔</span> Hasta 15 fotos
            </li>
            <li>
              <span className="check featured">✔</span> Aparece como destacada
            </li>
            <li>
              <span className="check featured">✔</span> Mayor visibilidad
            </li>
            <li>
              <span className="check featured">✔</span> Etiqueta de destacado
            </li>
          </ul>
          <button className="select-button teal" onClick={openOutstandingModal}>
            Seleccionar Plan
          </button>
        </div>
      </div>

      <PublicationBasic
        isOpen={isBasicModalOpen}
        onClose={closeBasicModal}
        onPublish={handlePublishSuccess}
      />
      <PublicationOutstanding
        isOpen={isOutstandingModalOpen}
        onClose={closeOutstandingModal}
        onPublish={handlePublishSuccess}
      />
    </div>
  );
}

export default Promotion;
