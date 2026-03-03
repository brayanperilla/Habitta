/**
 * PropiedadesSection - Sección de Mis Propiedades
 *
 * Muestra las propiedades publicadas por el usuario logueado
 * con opciones de editar, eliminar y pausar/reactivar.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { useToast } from "@application/context/ToastContext";
import { propertyService } from "@application/services/propertyService";
import type { Property } from "@domain/entities/Property";
import ConfirmModal from "@presentation/components/confirmModal/ConfirmModal";
import "./sections.css";

/**
 * Componente que muestra la lista de propiedades del usuario
 */
const PropiedadesSection: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [propiedades, setPropiedades] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (!usuario) {
        setPropiedades([]);
        setLoading(false);
        return;
      }
      try {
        const data = await propertyService.getPropertiesByUsuario(
          usuario.idusuario,
        );
        setPropiedades(data);
      } catch {
        /* silencioso */
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuario]);

  // Formatear precio
  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Formatear fecha
  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  // Eliminar propiedad
  const handleDeleteClick = (id: number) => {
    setPropertyToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    setDeleting(true);
    try {
      await propertyService.deleteProperty(propertyToDelete);
      setPropiedades((prev) =>
        prev.filter((p) => p.idpropiedad !== propertyToDelete),
      );
      showToast("Propiedad eliminada correctamente.", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al eliminar la propiedad.",
        "error",
      );
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    }
  };

  // Pausar / Reactivar publicación
  const handleToggleEstado = async (propiedad: Property) => {
    const nuevoEstado =
      propiedad.estadoPublicacion === "pausada" ? "activa" : "pausada";
    try {
      await propertyService.updateProperty(propiedad.idpropiedad, {
        estadoPublicacion: nuevoEstado,
      });
      setPropiedades((prev) =>
        prev.map((p) =>
          p.idpropiedad === propiedad.idpropiedad
            ? { ...p, estadoPublicacion: nuevoEstado }
            : p,
        ),
      );
      showToast(
        nuevoEstado === "pausada"
          ? "Publicación pausada."
          : "Publicación reactivada.",
        "success",
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al cambiar estado.",
        "error",
      );
    }
  };

  return (
    <div className="section-content">
      <div className="section-header-row">
        <h2 className="section-title">Mis Propiedades</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/registerpropeties")}
        >
          + Publicar Propiedad
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
          Cargando propiedades...
        </p>
      )}

      {/* Sin propiedades */}
      {!loading && propiedades.length === 0 && (
        <div className="empty-state">
          <svg
            className="empty-state__icon"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="empty-state__title">
            Aún no has publicado propiedades
          </h3>
          <p className="empty-state__description">
            Publica tu primera propiedad y comienza a recibir interesados
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/registerpropeties")}
          >
            Publicar mi primera propiedad
          </button>
        </div>
      )}

      {/* Lista de propiedades */}
      <div className="propiedades-list">
        {propiedades.map((propiedad) => (
          <div key={propiedad.idpropiedad} className="propiedad-card">
            {/* Thumbnail de la propiedad */}
            <div className="propiedad-card__thumbnail">
              {propiedad.fotoUrl ? (
                <img
                  src={propiedad.fotoUrl}
                  alt={propiedad.titulo || "Propiedad"}
                  className="propiedad-card__img"
                />
              ) : (
                <div className="propiedad-card__no-img">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="propiedad-card__info">
              <div className="propiedad-card__header">
                <h3 className="propiedad-card__title">
                  {propiedad.titulo || "Sin título"}
                </h3>
                <span
                  className={`estado-badge estado-badge--${(propiedad.estadoPublicacion || "pendiente").toLowerCase()}`}
                >
                  {propiedad.estadoPublicacion || "Pendiente"}
                </span>
              </div>

              <div className="propiedad-card__details">
                <span className="detail-item">
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0C5.243 0 3 2.243 3 5c0 4.5 5 11 5 11s5-6.5 5-11c0-2.757-2.243-5-5-5zm0 7.5c-1.381 0-2.5-1.119-2.5-2.5S6.619 2.5 8 2.5s2.5 1.119 2.5 2.5S9.381 7.5 8 7.5z" />
                  </svg>
                  {[propiedad.ciudad, propiedad.departamento]
                    .filter(Boolean)
                    .join(", ")}
                </span>
                <span className="detail-item">
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 2h4v4H2V2zm6 0h6v4H8V2zM2 8h4v6H2V8zm6 0h6v6H8V8z" />
                  </svg>
                  {propiedad.tipoPropiedad || "N/A"}
                </span>
              </div>

              <div className="propiedad-card__price">
                {formatPrice(propiedad.precio)}
              </div>

              <div className="propiedad-card__stats">
                <span className="stat-item">
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M3 2h10v12H3V2zm2 2v8h6V4H5z" />
                  </svg>
                  {formatFecha(propiedad.fechacreacion)}
                </span>
              </div>
            </div>

            <div className="propiedad-card__actions">
              {/* Ver */}
              <button
                className="action-btn action-btn--view"
                title="Ver"
                onClick={() =>
                  navigate(`/propertydetailspage/${propiedad.idpropiedad}`)
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM8 10a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {/* Editar */}
              <button
                className="action-btn action-btn--edit"
                title="Editar"
                onClick={() =>
                  navigate(`/registerpropeties?edit=${propiedad.idpropiedad}`)
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9 9a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9-9z" />
                </svg>
              </button>

              {/* Pausar / Reactivar */}
              <button
                className={`action-btn ${propiedad.estadoPublicacion === "pausada" ? "action-btn--reactivar" : "action-btn--pausar"}`}
                title={
                  propiedad.estadoPublicacion === "pausada"
                    ? "Reactivar"
                    : "Pausar"
                }
                onClick={() => handleToggleEstado(propiedad)}
              >
                {propiedad.estadoPublicacion === "pausada" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>

              {/* Eliminar */}
              <button
                className="action-btn action-btn--delete-prop"
                title="Eliminar"
                onClick={() => handleDeleteClick(propiedad.idpropiedad)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Eliminar propiedad"
        message="¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
      />
    </div>
  );
};

export default PropiedadesSection;
