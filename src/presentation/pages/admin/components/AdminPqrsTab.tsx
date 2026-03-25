import React, { useEffect, useState } from 'react';
import { pqrsApi, type Pqrs } from '@infrastructure/api/pqrs.api';
import './adminPqrs.css';

const AdminPqrsTab: React.FC = () => {
  const [pqrsList, setPqrsList] = useState<Pqrs[]>([]);
  const [selectedPqrs, setSelectedPqrs] = useState<Pqrs | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPqrs = async () => {
    setLoading(true);
    try {
      const data = await pqrsApi.getAllPqrs();
      setPqrsList(data);
    } catch (err) {
      console.error("Error fetching PQRS:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPqrs();
  }, []);

  const handleStatusChange = async (idpqrs: number, newStatus: string) => {
    try {
      await pqrsApi.updatePqrsStatus(idpqrs, newStatus);
      // Update local state to reflect change without refetching everything
      setPqrsList(prev => prev.map(p => 
        p.idpqrs === idpqrs ? { ...p, estado: newStatus } : p
      ));
      if (selectedPqrs && selectedPqrs.idpqrs === idpqrs) {
        setSelectedPqrs({ ...selectedPqrs, estado: newStatus });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Hubo un error al actualizar el estado");
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "N/A";
    const date = new Date(isoStr);
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="admin-empty-state">Cargando reportes PQRS...</div>;
  }

  // Detail View (Modal / Absolute overlay)
  if (selectedPqrs) {
    return (
      <div className="admin-pqrs-detail">
        <button className="btn-back" onClick={() => setSelectedPqrs(null)}>
          ← Volver a la lista
        </button>

        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h3>{selectedPqrs.tema}</h3>
              <span className="submit-date">Enviado: {formatDate(selectedPqrs.fechacreacion)}</span>
            </div>
            
            <div className="status-badge-container">
              <span className={`status-badge ${selectedPqrs.estado || 'pendiente'}`}>
                {selectedPqrs.estado === 'resuelto' ? 'Resuelto' : 
                 selectedPqrs.estado === 'en_revision' ? 'En Revisión' : 'Pendiente'}
              </span>
            </div>
          </div>

          <div className="detail-grid">
            <div className="info-group">
              <label>Nombres Completos</label>
              <p>{selectedPqrs.nombres_completos}</p>
            </div>
            <div className="info-group">
              <label>Celular</label>
              <p>{selectedPqrs.celular}</p>
            </div>
            <div className="info-group">
              <label>Correo Electrónico</label>
              <p>{selectedPqrs.correo}</p>
            </div>
            <div className="info-group">
              <label>Ubicación</label>
              <p>{selectedPqrs.ciudad}, {selectedPqrs.departamento}</p>
            </div>
            <div className="info-group">
              <label>ID Usuario</label>
              <p>{selectedPqrs.idusuario || 'Usuario no registrado (Visitante)'}</p>
            </div>
            <div className="info-group">
              <label>Perfil Identificado</label>
              <p>
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedPqrs.perfiles);
                    return Array.isArray(parsed) ? parsed.join(', ') : selectedPqrs.perfiles;
                  } catch {
                    return selectedPqrs.perfiles;
                  }
                })()}
              </p>
            </div>
          </div>

          <div className="mensaje-group">
            <label>Mensaje Detallado</label>
            <div className="mensaje-box">
              {selectedPqrs.mensaje}
            </div>
          </div>

          <div className="detail-actions">
            <h4>Actualizar Estado</h4>
            <div className="action-buttons">
              <button 
                className={`btn-status pending ${(!selectedPqrs.estado || selectedPqrs.estado === 'pendiente') ? 'active' : ''}`}
                onClick={() => handleStatusChange(selectedPqrs.idpqrs!, 'pendiente')}
                disabled={selectedPqrs.estado === 'en_revision' || selectedPqrs.estado === 'resuelto'}
              >
                Pendiente
              </button>
              <button 
                className={`btn-status review ${(selectedPqrs.estado === 'en_revision') ? 'active' : ''}`}
                onClick={() => handleStatusChange(selectedPqrs.idpqrs!, 'en_revision')}
                disabled={selectedPqrs.estado === 'resuelto'}
              >
                En Revisión
              </button>
              <button 
                className={`btn-status resolved ${(selectedPqrs.estado === 'resuelto') ? 'active' : ''}`}
                onClick={() => handleStatusChange(selectedPqrs.idpqrs!, 'resuelto')}
              >
                Marcar como Resuelto
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="admin-pqrs-tab">
      <div className="admin-pqrs-header-actions">
        <h2>Buzón de PQRS ({pqrsList.length})</h2>
        <button className="btn-refresh" onClick={fetchPqrs}>↻ Actualizar</button>
      </div>

      {pqrsList.length === 0 ? (
        <div className="admin-empty-state">No hay tickets de soporte o reportes PQRS en este momento.</div>
      ) : (
        <div className="pqrs-list">
          {pqrsList.map(pqrs => (
            <div 
              key={pqrs.idpqrs} 
              className={`pqrs-list-item ${pqrs.estado || 'pendiente'}`}
              onClick={() => setSelectedPqrs(pqrs)}
            >
              <div className="pqrs-item-main">
                <span className="pqrs-tema">{pqrs.tema}</span>
                <span className="pqrs-name">{pqrs.nombres_completos}</span>
                <p className="pqrs-snippet">{pqrs.mensaje.length > 100 ? pqrs.mensaje.substring(0, 100) + '...' : pqrs.mensaje}</p>
              </div>
              <div className="pqrs-item-meta">
                <span className="pqrs-date">{formatDate(pqrs.fechacreacion)}</span>
                <span className={`status-dot ${pqrs.estado || 'pendiente'}`}></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPqrsTab;
