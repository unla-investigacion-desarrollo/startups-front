import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProyectoCard.css';

const ProyectoCard = ({ 
  proyecto, 
  showActions = true,
  onDelete = null, 
  onToggleGanador = null 
}) => {
  const { isStaff, currentUser } = useAuth();
  
  const canEdit = currentUser && (isStaff() || currentUser.id === proyecto.creadoPorId);
  
  return (
    <div className={`proyecto-card ${proyecto.ganador ? 'ganador' : ''}`}>
      {proyecto.ganador && <div className="ganador-badge">Ganador</div>}
      
      <h3>{proyecto.titulo}</h3>
      
      {proyecto.creador && (
        <p className="autor">
          Por: {proyecto.creador.nombre || 'Usuario'}
        </p>
      )}
      
      <p className="fecha">
        {new Date(proyecto.creado_en).toLocaleDateString()}
      </p>
      
      <p className="descripcion-preview">
        {proyecto.descripcion.substring(0, 150)}
        {proyecto.descripcion.length > 150 ? '...' : ''}
      </p>
      
      {showActions && (
        <div className="proyecto-actions">
          <Link to={`/proyectos/${proyecto.id}`} className="btn-ver">
            Ver detalles
          </Link>
          
          <div className="action-buttons">
            {isStaff() && onToggleGanador && (
              <button 
                onClick={() => onToggleGanador(proyecto.id)}
                className={proyecto.ganador ? 'btn-remover-ganador' : 'btn-marcar-ganador'}
              >
                {proyecto.ganador ? 'Quitar ganador' : 'Marcar ganador'}
              </button>
            )}
            
            {canEdit && onDelete && (
              <button 
                onClick={() => onDelete(proyecto.id)}
                className="btn-eliminar"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectoCard;