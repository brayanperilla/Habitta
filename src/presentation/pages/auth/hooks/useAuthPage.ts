import { useState, useEffect } from "react";
// import img1 from "@presentation/assets/images/auth/dream_home_1.png";
// import img2 from "@presentation/assets/images/auth/dream_home_2.png";
// import img3 from "@presentation/assets/images/auth/dream_home_3.png";

// Imágenes de Fondo
const backgroundImages = [
  "/images/example/dream_home_1.png",
  "/images/example/dream_home_2.png",
  "/images/example/dream_home_3.png",
];

export function useAuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return {
    activeTab,
    setActiveTab,
    currentImageIndex,
    backgroundImages,
  };
}
