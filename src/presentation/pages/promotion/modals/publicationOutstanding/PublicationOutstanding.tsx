import React, { type FC } from "react";
import "./publicationOutstanding.css";

interface PublicationOutstandingProps {
	isOpen: boolean;
	onClose: () => void;
}

const PublicationOutstanding: FC<PublicationOutstandingProps> = ({
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className="outstanding-modal-overlay" onClick={handleOverlayClick}>
			<div className="outstanding-modal-content">
				<div className="outstanding-modal-header">
					<h2 className="outstanding-modal-title">Completar promoción</h2>
					<p className="outstanding-modal-subtitle">
						Selecciona la propiedad y método de pago
					</p>
				</div>

				<div className="outstanding-modal-body">
					<div className="form-group">
						<label className="form-label">Propiedad</label>
						<select className="form-input">
							<option disabled selected>
								Seleccione su Propiedad
							</option>
							{/* Cargar propiedades disponibles aquí */}
						</select>
					</div>

					<div className="form-group">
						<label className="form-label">Método de pago</label>
						<input className="form-input" defaultValue="Transferencia Bancaria" />
					</div>

					<div className="summary-box">
						<div className="summary-row">
							<span className="summary-label">Plan:</span>
							<span>Publicación destacada</span>
						</div>
						<div className="summary-row">
							<span className="summary-label">Duración:</span>
							<span>30 días</span>
						</div>
						<div className="summary-row" style={{ marginTop: "15px" }}>
							<span className="summary-label">Total:</span>
							<span>$199</span>
						</div>
					</div>

					<div className="modal-actions">
						<button className="btn-cancel" onClick={onClose}>
							Cancelar
						</button>
						<button
							className="btn-publish"
							onClick={() => {
								// Aquí puedes agregar la lógica de publicación / pago
								console.log("Publicar destacada");
								onClose();
							}}
						>
							Publicar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublicationOutstanding;

