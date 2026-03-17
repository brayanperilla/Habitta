import "./App.css";
import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "@presentation/components/layout/Layout";
import ScrollToTop from "@presentation/components/ScrollToTop";
import PrivateRoute from "@presentation/components/PrivateRoute";
import AdminRoute from "@presentation/components/AdminRoute";
import { useAuth } from "@application/context/AuthContext";

// Lazy-loaded pages — cada una se descarga solo cuando el usuario la visita
const Home = lazy(() => import("@presentation/pages/home/Home"));
const PropertiesPage = lazy(
  () => import("@presentation/pages/properties/PropertiesPage"),
);
const RegisterPropertyPage = lazy(
  () => import("@presentation/pages/registerpropeties/RegisterProperty"),
);
const Promotion = lazy(() => import("@presentation/pages/promotion/Promotion"));
const ToolsPage = lazy(() => import("@presentation/pages/tools/ToolsPage"));
const Auth = lazy(() => import("@presentation/pages/auth/Auth"));
const Favorites = lazy(() => import("@presentation/pages/favorites/Favorites"));
const PropertyDetailsPage = lazy(
  () => import("@presentation/pages/propertyDetails/PropertyDetailsPage"),
);
const Mypanel = lazy(() => import("@presentation/pages/myPanel/MyPanel"));
const NotificationPage = lazy(
  () =>
    import("@presentation/pages/notification/NotificationPage/Notification"),
);
const AdminPage = lazy(() => import("@presentation/pages/admin/AdminPage"));
const ErrorPage = lazy(
  () => import("@presentation/components/error/ErrorPage"),
);

// Spinner de carga entre páginas
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <div style={{ textAlign: "center", color: "#aaa" }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #35d2db",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <p style={{ fontSize: "0.9rem" }}>Cargando...</p>
    </div>
  </div>
);

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
      <Route
        index
        element={
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        }
      />

      {/* Propiedades */}
      <Route
        path="properties"
        element={
          <Suspense fallback={<PageLoader />}>
            <PropertiesPage />
          </Suspense>
        }
      />

      {/* Promociones */}
      <Route
        path="promotion"
        element={
          <Suspense fallback={<PageLoader />}>
            <Promotion />
          </Suspense>
        }
      />

      {/* Herramientas */}
      <Route
        path="tools"
        element={
          <Suspense fallback={<PageLoader />}>
            <ToolsPage />
          </Suspense>
        }
      />

      {/* Autenticación */}
      <Route
        path="auth"
        element={
          <Suspense fallback={<PageLoader />}>
            <Auth />
          </Suspense>
        }
      />

      {/* Ruta de Detalles de Propiedad */}
      <Route
        path="propertydetailspage/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <PropertyDetailsPage />
          </Suspense>
        }
      />

      {/* ── Rutas protegidas (requieren sesión) ── */}
      <Route element={<PrivateRoute />}>
        <Route
          path="registerpropeties"
          element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPropertyPage />
            </Suspense>
          }
        />
        <Route
          path="favorites"
          element={
            <Suspense fallback={<PageLoader />}>
              <Favorites />
            </Suspense>
          }
        />
        <Route
          path="mypanel"
          element={
            <Suspense fallback={<PageLoader />}>
              <Mypanel />
            </Suspense>
          }
        />
        <Route
          path="notification"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotificationPage />
            </Suspense>
          }
        />
      </Route>

      {/* ── Rutas protegidas (Solo Admin) ── */}
      <Route element={<AdminRoute />}>
        <Route
          path="admin"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminPage />
            </Suspense>
          }
        />
      </Route>

      {/* 404 — Ruta no encontrada */}
      <Route
        path="*"
        element={
          <Suspense fallback={<PageLoader />}>
            <ErrorPage code={404} />
          </Suspense>
        }
      />
    </Route>,
  ),
);

// Componente Principal de la Aplicación
function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        {/* Loader global en raíz para evitar parpadeos completos (flicker) */}
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
