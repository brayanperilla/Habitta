import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { supabase } from "@infrastructure/supabase/client";
import "./promotion.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { usuario, updatePerfil } = useAuth();
  const [upgrading, setUpgrading] = useState(true);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    const upgradeToPremium = async () => {
      if (!usuario) {
        setUpgrading(false);
        return;
      }

      try {
        // Actualizar directamente en Supabase
        const { error } = await supabase
          .from("usuarios")
          .update({ plan: "premium", rol: "premium" })
          .eq("idusuario", usuario.idusuario);

        if (error) {
          console.error("Error al actualizar a premium:", error);
        } else {
          // Refrescar el contexto de auth para que toda la app refleje el cambio
          await updatePerfil({ plan: "premium" });
          setUpgraded(true);

          // Insertar notificación de bienvenida
          await supabase.from("notificaciones").insert({
            idusuario: usuario.idusuario,
            titulo: "¡Bienvenido a Premium! 🚀",
            descripcion:
              "Tu pago ha sido procesado exitosamente. Gracias por confiar en Habitta. Ahora disfrutas de todos los beneficios del plan Premium.",
            tipo: "cuenta",
            leido: false,
            fechaEnvio: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error en upgrade:", err);
      } finally {
        setUpgrading(false);
      }
    };

    upgradeToPremium();
  }, [usuario]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirigir automáticamente al panel después de 5 segundos
  useEffect(() => {
    if (!upgrading) {
      const timer = setTimeout(() => {
        navigate("/mypanel", { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [upgrading, navigate]);

  return (
    <div
      className="promo-page-container"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="promo-card premium"
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {upgrading ? (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #35d2db",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 1.5rem",
              }}
            />
            <h2 className="promo-title">Activando tu plan Premium...</h2>
            <p className="promo-subtitle" style={{ color: "#6b7280" }}>
              Estamos procesando tu pago. No cierres esta ventana.
            </p>
          </>
        ) : (
          <>
            <svg
              stroke="#2dd4bf"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="80px"
              width="80px"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginBottom: "1.5rem" }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>

            <div className="promo-header">
              <span className="promo-badge">¡Pago Exitoso!</span>
              <h2 className="promo-title">¡Bienvenido a Premium!</h2>
            </div>

            <p className="promo-subtitle" style={{ color: "#374151" }}>
              {upgraded
                ? "Muchísimas gracias por confiar en Habitta. Tu cuenta ha sido actualizada a Premium exitosamente. ¡Ya puedes disfrutar de todos los beneficios!"
                : "Tu pago se ha registrado. Si tu cuenta no aparece como Premium de inmediato, espera unos minutos y recarga la página."}
            </p>

            <p
              className="promo-subtitle"
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginTop: "1rem",
              }}
            >
              Serás redirigido a tu panel en 5 segundos...
            </p>

            <button
              className="promo-btn premium-btn"
              onClick={() => navigate("/mypanel", { replace: true })}
              style={{ marginTop: "2rem", width: "100%", maxWidth: "300px" }}
            >
              Ir a tu Panel →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
