import React, { type FC } from "react";
import "./successAlertStack.css";

export interface Alert {
  id: string;
  message: string;
}

interface SuccessAlertStackProps {
  alerts: Alert[];
  onRemove: (id: string) => void;
}

const SuccessAlertStack: FC<SuccessAlertStackProps> = ({ alerts, onRemove }) => {
  return (
    <div className="success-alert-stack-container">
      {alerts.map((alert, index) => (
        <div key={alert.id} className="success-alert" style={{ top: `${index * 70}px` }}>
          <span className="success-icon">✓</span>
          <p className="success-message">{alert.message}</p>
        </div>
      ))}
    </div>
  );
};

export default SuccessAlertStack;
