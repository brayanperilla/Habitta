import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styleTools.css";

function ToolsPage() {
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState<number | string>(3000);
  const [fixedExpenses, setFixedExpenses] = useState<number | string>("");
  const [results, setResults] = useState({
    maxMonthlyPayment: 1200,
    percentageAvailable: 40,
    estimatedCredit: { min: 144000, max: 180000 },
  });

  const calculateCapacity = () => {
    const income = typeof monthlyIncome === "string" ? 0 : monthlyIncome;
    const expenses = typeof fixedExpenses === "string" ? 0 : fixedExpenses;
    const availableIncome = income - expenses;
    // RF72: 40% de endeudamiento máximo (estándar BanRep Colombia)
    const maxMonthlyPayment = availableIncome * 0.40;
    const estimatedCreditMin = maxMonthlyPayment * 120;
    const estimatedCreditMax = maxMonthlyPayment * 150;

    setResults({
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      percentageAvailable: 40,
      estimatedCredit: {
        min: Math.round(estimatedCreditMin),
        max: Math.round(estimatedCreditMax),
      },
    });
  };

  const financialTips = [
    {
      title: "Ahorro para el enganche",
      description:
        "Se recomienda ahorrar al menos el 20% del valor de la propiedad como enganche para obtener mejores condiciones crediticias.",
    },
    {
      title: "Regla del 30-40%",
      description:
        "Tu cuota mensual no debería superar el 30-40% de tus ingresos netos para mantener un equilibrio financiero saludable.",
    },
    {
      title: "Gastos adicionales",
      description:
        "Considera costos adicionales como escrituración, avalúo, seguros y mantenimiento al calcular tu presupuesto.",
    },
    {
      title: "Historial crediticio",
      description:
        "Mantén un buen historial crediticio para acceder a mejores tasas de interés y condiciones de financiamiento.",
    },
    {
      title: "Comparar opciones",
      description:
        "Compara diferentes bancos y entidades financieras para encontrar la mejor tasa y condiciones que se ajusten a tu perfil.",
    },
  ];

  const externalResources = [
    {
      title: "Vídeos de educación financiera en Colombia",
      url: "https://www.youtube.com/results?search_query=educacion+financiera+colombia",
    },
    {
      title: "Programa de educación financiera - Asobancaria",
      url: "https://www.asobancaria.com/educacion-financiera/",
    },
    {
      title: "Superintendencia financiera - Educación",
      url: "https://www.superfinanciera.gov.co/publicaciones/10114676/innovasfcfinanzas-abiertasfinanzas-abiertas-colombia-10114676/",
    },
  ];

  return (
    <div className="tools-page">
      <h1 className="tools-title">Calculadora financiera</h1>
      <p className="tools-subtitle">
        Calcula tu capacidad de crédito y descubre propiedades dentro de tu presupuesto
      </p>

      <div className="financial-calculator">
        {/* Sección de calculadora */}
        <div className="calculator-section">
          <div className="calculator-header">
            <img
              className="calculator-icon"
              src="/icons/UI/navbaricons/calculator-svgrepo-com.svg"
              alt="Icono calculadora"
            />
            <h2>Calculadora de crédito</h2>
          </div>
          <p className="calculator-subtitle">
            Ingresa tus datos financieros para calcular tu capacidad de pago
          </p>

          <div className="form-group">
            <label>Ingreso mensual neto</label>
            <input
              type="number"
              value={monthlyIncome}
              min="0"
              onChange={(e) => setMonthlyIncome(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Gastos mensuales fijos (opcional)</label>
            <input
              type="number"
              value={fixedExpenses}
              min="0"
              onChange={(e) => setFixedExpenses(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
              placeholder="0"
            />
          </div>

          <button className="btn-calculate" onClick={calculateCapacity}>
            Calcular Capacidad
          </button>
        </div>

        {/* Sección de Resultados */}
        <div className="results-section">
          <div className="results-header">
            <span className="results-icon">✓</span>
            <h2>Resultados</h2>
          </div>
          <p className="results-subtitle">Cuota Máxima Mensual</p>

          <div className="result-amount">
            ${results.maxMonthlyPayment.toLocaleString()}
          </div>

          <p className="result-percentage">
            {results.percentageAvailable}% de tu ingreso disponible
          </p>

          <hr className="divider" />

          <p className="result-label">Crédito Estimado</p>
          <div className="result-credit-range">
            ${results.estimatedCredit.min.toLocaleString()} - $
            {results.estimatedCredit.max.toLocaleString()}
          </div>

          <p className="result-note">
            Basado en plazo de 10 a 12.5 años
          </p>

          <button
            className="btn-view-properties"
            onClick={() => navigate(`/properties?precioMax=${results.estimatedCredit.max}`)}
          >
            Ver Propiedades en mi Presupuesto
          </button>

        </div>
      </div>

      {/* Sección de Tarjetas de Consejos */}
      <div className="tips-card">
        <div className="tips-header">
          <span className="tips-icon">📋</span>
          <h2>Calculadora de crédito</h2>
        </div>
        <p className="tips-subtitle">Aprende a gestionar mejor tus finanzas</p>

        <div className="tips-list">
          {financialTips.map((tip, index) => (
            <div key={index} className="tip-item">
              <div className="tip-bar"></div>
              <div className="tip-content">
                <h3 className="tip-title">{tip.title}</h3>
                <p className="tip-description">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="external-resources">
          <h3 className="resources-title">Recursos externos</h3>
          <div className="resources-list">
            {externalResources.map((resource, index) => (
              <a key={index} href={resource.url} className="resource-link">
                <span className="resource-icon">↗</span>
                {resource.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsPage;
