import { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  if (!visible || !message) return null;
  
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">{message}</div>
      <button 
        className="alert-close" 
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;