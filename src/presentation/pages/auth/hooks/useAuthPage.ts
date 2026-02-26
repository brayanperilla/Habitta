import { useState, useEffect } from "react";

/** Imágenes de fondo del carrusel */
const bgImages = [
  "/images/example/dream_home_1.png",
  "/images/example/dream_home_2.png",
  "/images/example/dream_home_3.png",
];

/** Hook de la página de autenticación — carrusel de fondo + tabs */
export function useAuthPage() {
  const [activeTab, setActiveTab] = useState<
    "login" | "register" | "forgot" | "reset"
  >("login");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Escuchar cambios de modo de autenticación externos (ej: desde Login)
  useEffect(() => {
    const handleSwitch = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener("switch-auth-mode", handleSwitch);
    return () => window.removeEventListener("switch-auth-mode", handleSwitch);
  }, []);

  // Verificar si hay un hash de recuperación en la URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "reset") {
      setActiveTab("reset");
    }
  }, []);

  // Rotar imagen cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((i) => (i + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return {
    activeTab,
    setActiveTab,
    currentImageIndex,
    backgroundImages: bgImages,
  };
}
