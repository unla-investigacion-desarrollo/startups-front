import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { proyectosService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProyectoDetail.css';

const ProyectoDetail = () => {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        setLoading(true);
        const { data } = await proyectosService.getById(id);
        setProyecto(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el proyecto:', err);
        setError('No se pudo cargar el proyecto. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id]);

  const handleToggleGanador = async () => {
    try {
      await proyectosService.toggleGanador(id);
      setProyecto(prev => ({
        ...prev,
        ganador: !prev.ganador
      }));
    } catch (err) {
      console.error('Error al cambiar el estado de ganador:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await proyectosService.delete(id);
        navigate('/convocatorias');
      } catch (err) {
        console.error('Error al eliminar el proyecto:', err);
      }
    }
  };

  const canEdit = () => {
    if (!currentUser || !proyecto) return false;
    return isStaff() || currentUser.id === proyecto.creadoPorId;
  };

  if (loading) {
    return <div className="loading">Cargando detalles del proyecto...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!proyecto) {
    return <div className="error-container">No se encontró el proyecto.</div>;
  }

  return (
    <div className="proyecto-detail-container">
      <div className={`proyecto-header ${proyecto.ganador ? 'ganador' : ''}`}>
        {proyecto.ganador && <div className="ganador-badge">Proyecto Ganador</div>}
        
        <div className="title-section">
          <h1>{proyecto.titulo}</h1>
          <p className="creation-date">
            Creado el {new Date(proyecto.creado_en).toLocaleDateString()}
          </p>
          <p className="autor">
            Por: {proyecto.creador?.nombre || 'Usuario'}
          </p>
        </div>
        
        <div className="actions-container">
          {canEdit() && (
            <Link to={`/editar-proyecto/${proyecto.id}`} className="btn-editar">
              Editar proyecto
            </Link>
          )}
          
          {(isStaff() || (currentUser && currentUser.id === proyecto.creadoPorId)) && (
            <button onClick={handleDelete} className="btn-eliminar">
              Eliminar
            </button>
          )}
          
          {isStaff() && (
            <button 
              onClick={handleToggleGanador}
              className={proyecto.ganador ? 'btn-remover-ganador' : 'btn-marcar-ganador'}
            >
              {proyecto.ganador ? 'Quitar ganador' : 'Marcar como ganador'}
            </button>
          )}
        </div>
      </div>

      <div className="proyecto-content">
        <div className="descripcion">
          <h2>Descripción</h2>
          <p>{proyecto.descripcion}</p>
        </div>

        <div className="contacto-info">
          <h2>Información de contacto</h2>
          {proyecto.contacto_email && (
            <div className="contacto-item">
              <strong>Email:</strong> {proyecto.contacto_email}
            </div>
          )}
          {proyecto.contacto_campus && (
            <div className="contacto-item">
              <strong>Campus:</strong> {proyecto.contacto_campus}
            </div>
          )}
        </div>

        <div className="convocatoria-info">
          <h2>Convocatoria</h2>
          {proyecto.convocatoria ? (
            <div className="convocatoria-card">
              <h3>{proyecto.convocatoria.titulo}</h3>
              <p>{proyecto.convocatoria.descripcion.substring(0, 150)}...</p>
              <Link to={`/convocatorias/${proyecto.convocatoriaId}`} className="btn-ver">
                Ver convocatoria
              </Link>
            </div>
          ) : (
            <p>Este proyecto no está asociado a ninguna convocatoria.</p>
          )}
        </div>
      </div>

      <div className="back-navigation">
        <Link to={proyecto.convocatoriaId ? `/convocatorias/${proyecto.convocatoriaId}` : '/convocatorias'} className="btn-back">
          Volver a la convocatoria
        </Link>
      </div>
    </div>
  );
};

export default ProyectoDetail;