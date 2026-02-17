/**
 * UserModal - Modal de menú de usuario
 *
 * Este componente muestra un menú desplegable con opciones del usuario
 * cuando se hace clic en el ícono de usuario en la barra de navegación.
 * Incluye la opción de cerrar sesión con Supabase Auth.
 */

import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import "./userModal.css";

/**
 * Propiedades del componente UserModal
 */
interface UserModalProps {
  /** Indica si el modal está visible */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
}

/**
 * Componente de modal de usuario
 * Muestra las opciones disponibles para el usuario autenticado
 */
const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  /**
   * Efecto para cerrar el modal al hacer clic fuera de él
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  /**
   * Maneja el cierre de sesión real con Supabase Auth
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  /**
   * Opciones del menú de usuario (sin "Cerrar Sesión", que se maneja aparte)
   */
  const menuOptions = [
    {
      id: 1,
      label: "Panel de Usuario",
      icon: "/icons/UI/navbaricons/user-alt-1-svgrepo-com.svg",
      link: "/myPanel",
    },
    {
      id: 2,
      label: "Promociones",
      icon: "/icons/UI/navbaricons/star-alt-4-svgrepo-com.svg",
      link: "/promotion",
    },
    {
      id: 3,
      label: "PQRS",
      icon: "/icons/UI/navbaricons/message-circle-chat-svgrepo-com.svg",
      link: "/pqrs",
    },
    {
      id: 4,
      label: "Panel Admin",
      icon: "/icons/UI/navbaricons/admin-svgrepo-com.svg",
      link: "/admin",
    },
  ];

  return (
    <div className="user-modal" ref={modalRef}>
      <div className="user-modal__container">
        {/* Lista de opciones del menú */}
        <ul className="user-modal__menu">
          {menuOptions.map((option) => (
            <li key={option.id} className="user-modal__item">
              <Link
                to={option.link}
                className="user-modal__link"
                onClick={onClose}
              >
                <span className="user-modal__icon">
                  <img
                    src={option.icon}
                    alt={option.label}
                    style={{ width: "20px", height: "20px" }}
                  />
                </span>
                <span className="user-modal__label">{option.label}</span>
              </Link>
            </li>
          ))}

          {/* Botón de cerrar sesión — usa signOut real */}
          <li className="user-modal__item user-modal__item--logout">
            <button
              className="user-modal__link"
              onClick={handleSignOut}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 1rem",
                fontSize: "inherit",
                color: "inherit",
              }}
            >
              <span className="user-modal__icon">
                <img
                  src="/icons/UI/navbaricons/house-01-svgrepo-com.svg"
                  alt="Cerrar Sesión"
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
              <span className="user-modal__label">Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserModal;
