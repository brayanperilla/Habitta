import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import { useAuthPage } from "./hooks/useAuthPage";
import "./Auth.css";

// Componente Contenedor de Autenticación
// Gestiona el carrusel de fondo y las pestañas de login/registro
function Auth() {
  const { activeTab, setActiveTab, currentImageIndex, backgroundImages } =
    useAuthPage();

  const isRecoveryMode = activeTab === "forgot" || activeTab === "reset";

  return (
    <div className="auth-container">
      {/* Carrusel de Fondo */}
      <div className="auth-carousel">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentImageIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="carousel-overlay"></div>
      </div>

      {/* Tarjeta Principal de Autenticación */}
      <div className="auth-card">
        <div className="auth-header">
          <h1>Bienvenido a Habitta</h1>
          <p>
            {activeTab === "forgot"
              ? "Recupera tu acceso"
              : activeTab === "reset"
                ? "Nueva contraseña"
                : "Encuentra tu hogar ideal"}
          </p>
        </div>

        {/* Pestañas de Navegación — Ocultas en modo recuperación */}
        {!isRecoveryMode && (
          <div className="auth-tabs">
            <button
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab-button ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Registrarse
            </button>
          </div>
        )}

        {/* Contenido del Formulario */}
        <div className="auth-content">
          {activeTab === "login" && <Login />}
          {activeTab === "register" && <Register />}
          {activeTab === "forgot" && <ForgotPassword />}
          {activeTab === "reset" && <ResetPassword />}
        </div>

        <div className="home-link">
          <a href="/">Volver al inicio</a>
        </div>
      </div>
    </div>
  );
}

export default Auth;
