import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "@presentation/components/layout/Layout";
import Home from "@presentation/pages/home/Home";
import PropertiesPage from "@presentation/pages/properties/PropertiesPage";
import RegisterPropertyPage from "@presentation/pages/registerpropeties/RegisterPropertyPage";
import Promotion from "@presentation/pages/promotion/Promotion";
import ToolsPage from "@presentation/pages/tools/ToolsPage";
import Auth from "@presentation/pages/auth/Auth";
import Notification from "@presentation/pages/notification/NotificationPage/Notification";

// Componente Principal de la Aplicación
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Inicio */}
          <Route index element={<Home />} />

          {/* Propiedades */}
          <Route path="properties" element={<PropertiesPage />} />

          {/* Registrar Propiedad */}
          <Route path="registerpropeties" element={<RegisterPropertyPage />} />

          {/* Promociones */}
          <Route path="promotion" element={<Promotion />} />

          {/* Herramientas */}
          <Route path="tools" element={<ToolsPage />} />

          {/* Autenticación */}
          <Route path="auth" element={<Auth />} />

          <Route path="Notification" element={<Notification />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
