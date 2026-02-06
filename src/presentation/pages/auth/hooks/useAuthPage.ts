import { useState, useEffect } from "react";
// import img1 from "@presentation/assets/images/auth/dream_home_1.png";
// import img2 from "@presentation/assets/images/auth/dream_home_2.png";
// import img3 from "@presentation/assets/images/auth/dream_home_3.png";

// Imágenes de Fondo
const backgroundImages = [
  "/images/auth/dream_home_1.png",
  "/images/auth/dream_home_2.png",
  "/images/auth/dream_home_3.png",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80", // Penthouse de Lujo
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80", // Villa Moderna
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
