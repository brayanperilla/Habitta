import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "@presentation/components/layout/Layout";
import ScrollToTop from "@presentation/components/ScrollToTop";
import Home from "@presentation/pages/home/Home";
import PropertiesPage from "@presentation/pages/properties/PropertiesPage";
import RegisterPropertyPage from "@presentation/pages/registerpropeties/RegisterProperty";
import Promotion from "@presentation/pages/promotion/Promotion";
import ToolsPage from "@presentation/pages/tools/ToolsPage";
import Auth from "@presentation/pages/auth/Auth";
import Favorites from "@presentation/pages/favorites/Favorites";
import PropertyDetailsPage from "@presentation/pages/propertyDetails/PropertyDetailsPage";
import Mypanel from "@presentation/pages/myPanel/MyPanel";
import NotificationPage from "@presentation/pages/notification/NotificationPage/Notification";
import ErrorPage from "@presentation/components/error/ErrorPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <>
          <ScrollToTop />
          <Layout />
        </>
      }
    >
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

      {/* Favoritos */}
      <Route path="favorites" element={<Favorites />} />

      {/* Mi Panel */}
      <Route path="mypanel" element={<Mypanel />} />

      {/* Notificaciones */}
      <Route path="notification" element={<NotificationPage />} />

      {/* Ruta de Detalles de Propiedad */}
      <Route path="propertydetailspage/:id" element={<PropertyDetailsPage />} />

      {/* 404 — Ruta no encontrada */}
      <Route path="*" element={<ErrorPage code={404} />} />
    </Route>,
  ),
);

// Componente Principal de la Aplicación
function App() {
  return <RouterProvider router={router} />;
}

export default App;