import { type FC, useEffect } from "react";
import "./successAlert.css";

interface SuccessAlertProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number; // Duración en milisegundos antes del cierre automático
}

const SuccessAlert: FC<SuccessAlertProps> = ({
  isVisible,
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="success-alert-container">
      <div className="success-alert">
        <span className="success-icon">✓</span>
        <p className="success-message">{message}</p>
      </div>
    </div>
  );
};

export default SuccessAlert;

