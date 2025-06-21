import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ConvocatoriaCard.css';

const ConvocatoriaCard = ({ 
  convocatoria, 
  showActions = true,
  onToggle = null, 
  onDelete = null 
}) => {
  const { isStaff } = useAuth();
  
  return (
    <div className={`convocatoria-card ${!convocatoria.abierta ? 'closed' : ''}`}>
      <div className="status-badge">
        {convocatoria.abierta ? 'Abierta' : 'Cerrada'}
      </div>
      
      <h3>{convocatoria.titulo}</h3>
      
      <p className="fecha">
        Creada: {new Date(convocatoria.creada_en).toLocaleDateString()}
      </p>
      
      <p className="descripcion-preview">
        {convocatoria.descripcion.substring(0, 150)}
        {convocatoria.descripcion.length > 150 ? '...' : ''}
      </p>
      
      {showActions && (
        <div className="convocatoria-actions">
          <Link to={`/convocatorias/${convocatoria.id}`} className="btn-ver">
            Ver detalles
          </Link>
          
          {isStaff() && (
            <div className="admin-actions">
              {onToggle && (
                <button
                  onClick={() => onToggle(convocatoria.id)}
                  className={convocatoria.abierta ? 'btn-cerrar' : 'btn-abrir'}
                >
                  {convocatoria.abierta ? 'Cerrar' : 'Abrir'}
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(convocatoria.id)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConvocatoriaCard;