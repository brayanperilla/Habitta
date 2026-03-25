import React, { useState } from 'react';
import { useAuth } from '@application/context/AuthContext';
import { pqrsApi } from '@infrastructure/api/pqrs.api';
import './pqrsPage.css';

const TEMAS = [
  'Servicio al cliente',
  'Asesoría comercial',
  'Preguntas sobre el sector inmobiliario',
  'Quejas y reclamos'
];

const PERFILES = [
  { id: '1', label: 'Represento una inmobiliaria' },
  { id: '2', label: 'Represento una constructora' },
  { id: '4', label: 'Soy una persona natural' }
];

const PqrsPage: React.FC = () => {
  const { usuario } = useAuth();
  
  const [formData, setFormData] = useState({
    tema: TEMAS[0],
    nombres_completos: '',
    celular: '',
    correo: usuario?.correo || '',
    ciudad: '',
    departamento: '',
    mensaje: '',
    acepta_terminos: false
  });
  
  const [selectedPerfiles, setSelectedPerfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorConfig, setErrorConfig] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      if (name === 'mensaje' && value.length > 3000) return;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePerfilChange = (label: string) => {
    setSelectedPerfiles(prev => 
      prev.includes(label) 
        ? prev.filter(p => p !== label)
        : [...prev, label]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acepta_terminos) {
      setErrorConfig("Debes aceptar los términos y condiciones.");
      return;
    }
    
    if (selectedPerfiles.length === 0) {
      setErrorConfig("Debes seleccionar al menos un perfil que te describa.");
      return;
    }

    if (!formData.nombres_completos || !formData.celular || !formData.correo || !formData.ciudad || !formData.departamento || !formData.mensaje) {
      setErrorConfig("Todos los campos excepto el perfil son obligatorios.");
      return;
    }

    setLoading(true);
    setErrorConfig(null);

    try {
      await pqrsApi.createPqrs({
        idusuario: usuario?.idusuario || null,
        tema: formData.tema,
        nombres_completos: formData.nombres_completos,
        celular: formData.celular,
        correo: formData.correo,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        perfiles: JSON.stringify(selectedPerfiles),
        mensaje: formData.mensaje,
        acepta_terminos: formData.acepta_terminos
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorConfig("Hubo un error al enviar tu solicitud. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pqrs-page-container">
        <div className="pqrs-success-container">
          <h2 className="pqrs-success-title">¡Gracias por contactarnos!</h2>
          <div className="pqrs-success-message">
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="success-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p className="success-text">Tu solicitud ha sido enviada correctamente.</p>
            <div className="response-time-box">
              <p>Nuestro equipo te dará una respuesta en un tiempo máximo de <strong>72 horas</strong>.</p>
            </div>
            <button className="btn-enviar-otra" onClick={() => setSuccess(false)}>
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pqrs-page-container">
      <div className="pqrs-section">
        <div className="pqrs-header">
          <h2 className="pqrs-hero-title">¿Cómo podemos ayudarte?</h2>
          <p className="pqrs-hero-subtitle">Ingresa la siguiente información, pronto te responderemos</p>
        </div>

        <form onSubmit={handleSubmit} className="pqrs-form">
          <div className="form-group">
            <label>¿Qué tema necesitas resolver?</label>
            <select name="tema" value={formData.tema} onChange={handleInputChange} className="form-input">
              {TEMAS.map(tema => (
                <option key={tema} value={tema}>{tema}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombres completos</label>
              <input 
                type="text" 
                name="nombres_completos" 
                value={formData.nombres_completos} 
                onChange={handleInputChange} 
                placeholder="Ej: Juan Pérez" 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label>Número de celular</label>
              <input 
                type="tel" 
                name="celular" 
                value={formData.celular} 
                onChange={handleInputChange} 
                placeholder="Ej: 3002548524" 
                className="form-input"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              name="correo" 
              value={formData.correo} 
              onChange={handleInputChange} 
              placeholder="Ej: joe@correo.com" 
              className="form-input"
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Selecciona tu ciudad</label>
              <input 
                type="text" 
                name="ciudad" 
                value={formData.ciudad} 
                onChange={handleInputChange} 
                placeholder="Ej: Bogotá" 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label>Selecciona tu departamento</label>
              <input 
                type="text" 
                name="departamento" 
                value={formData.departamento} 
                onChange={handleInputChange} 
                placeholder="Ej: Cundinamarca" 
                className="form-input"
                required 
              />
            </div>
          </div>

          <div className="form-group perfiles-group">
            <div className="label-flex">
              <label>¿Qué perfil te describe?</label>
              <span className="optional-text">Opcional</span>
            </div>
            <div className="checkbox-list">
              {PERFILES.map(perfil => (
                <label key={perfil.id} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedPerfiles.includes(perfil.label)}
                    onChange={() => handlePerfilChange(perfil.label)} 
                  />
                  <span className="checkbox-custom"></span>
                  {perfil.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>En qué te podemos apoyar</label>
            <textarea 
              name="mensaje" 
              value={formData.mensaje} 
              onChange={handleInputChange} 
              placeholder="Estoy interesado en..." 
              className="form-textarea"
              maxLength={3000}
              required 
            />
            <span className="char-counter">{formData.mensaje.length} / 3000</span>
          </div>

          <div className="form-group terms-group">
            <label className="checkbox-label terms-label">
              <input 
                type="checkbox" 
                name="acepta_terminos" 
                checked={formData.acepta_terminos} 
                onChange={handleInputChange} 
                required
              />
              <span className="checkbox-custom"></span>
              <div className="terms-text">
                He leído y autorizo el tratamiento de mis datos personales de acuerdo con la <strong>Política de Datos Personales</strong> y la <strong>Política de Datos de Navegación/Cookies</strong>.<br/>
                He leído y acepto los <strong>Términos y Condiciones</strong> del portal.
              </div>
            </label>
          </div>

          {errorConfig && (
            <div className="pqrs-error">
              {errorConfig}
            </div>
          )}

          <div className="form-actions" style={{display: 'flex', justifyContent: 'flex-start', marginTop: '20px'}}>
            <button 
              type="submit" 
              className="btn-submit-pqrs" 
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'} 
              {!loading && <span className="arrow">➔</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PqrsPage;
