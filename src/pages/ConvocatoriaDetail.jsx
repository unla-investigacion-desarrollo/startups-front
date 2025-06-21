import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { convocatoriasService, proyectosService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ConvocatoriaDetail.css';

const ConvocatoriaDetail = () => {
  const { id } = useParams();
  const [convocatoria, setConvocatoria] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles de la convocatoria
        const convocatoriaResponse = await convocatoriasService.getById(id);
        setConvocatoria(convocatoriaResponse.data);
        
        // Obtener los proyectos de la convocatoria
        const proyectosResponse = await convocatoriasService.getProyectos(id);
        setProyectos(proyectosResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleAbierta = async () => {
    try {
      await convocatoriasService.toggleAbierta(id);
      setConvocatoria(prev => ({
        ...prev,
        abierta: !prev.abierta
      }));
    } catch (err) {
      console.error('Error al cambiar el estado de la convocatoria:', err);
    }
  };

  const handleDeleteConvocatoria = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta convocatoria? Esta acción no se puede deshacer.')) {
      try {
        await convocatoriasService.delete(id);
        navigate('/convocatorias');
      } catch (err) {
        console.error('Error al eliminar la convocatoria:', err);
      }
    }
  };

  const handleToggleGanador = async (proyectoId) => {
    try {
      await proyectosService.toggleGanador(proyectoId);
      setProyectos(prevProyectos => 
        prevProyectos.map(proyecto => 
          proyecto.id === proyectoId 
            ? {...proyecto, ganador: !proyecto.ganador} 
            : proyecto
        )
      );
    } catch (err) {
      console.error('Error al marcar el proyecto como ganador:', err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!convocatoria) {
    return <div className="error-container">No se encontró la convocatoria.</div>;
  }

  return (
    <div className="convocatoria-detail-container">
      <div className={`convocatoria-header ${!convocatoria.abierta ? 'closed' : ''}`}>
        <div className="title-section">
          <h1>{convocatoria.titulo}</h1>
          <span className={`status-badge ${convocatoria.abierta ? 'open' : 'closed'}`}>
            {convocatoria.abierta ? 'Abierta' : 'Cerrada'}
          </span>
          <p className="creation-date">
            Creada el {new Date(convocatoria.creada_en).toLocaleDateString()}
          </p>
        </div>
        
        {isStaff() && (
          <div className="admin-actions">
            <button 
              className={convocatoria.abierta ? 'btn-cerrar' : 'btn-abrir'}
              onClick={handleToggleAbierta}
            >
              {convocatoria.abierta ? 'Cerrar convocatoria' : 'Abrir convocatoria'}
            </button>
            <button 
              className="btn-eliminar"
              onClick={handleDeleteConvocatoria}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="convocatoria-content">
        <div className="descripcion">
          <h2>Descripción</h2>
          <p>{convocatoria.descripcion}</p>
        </div>

        <div className="proyectos-section">
          <div className="proyectos-header">
            <h2>Proyectos ({proyectos.length})</h2>
            {currentUser && convocatoria.abierta && (
              <Link to={`/crear-proyecto?convocatoria=${id}`} className="btn-crear-proyecto">
                Presentar proyecto
              </Link>
            )}
          </div>

          {proyectos.length === 0 ? (
            <p className="no-proyectos">No hay proyectos presentados para esta convocatoria.</p>
          ) : (
            <div className="proyectos-list">
              {proyectos.map(proyecto => (
                <div key={proyecto.id} className={`proyecto-card ${proyecto.ganador ? 'ganador' : ''}`}>
                  {proyecto.ganador && <div className="ganador-badge">Ganador</div>}
                  <h3>{proyecto.titulo}</h3>
                  <p className="proyecto-autor">
                    Por: {proyecto.creador?.nombre || 'Usuario'}
                  </p>
                  <p className="proyecto-excerpt">
                    {proyecto.descripcion.substring(0, 150)}...
                  </p>
                  <div className="proyecto-actions">
                    <Link to={`/proyectos/${proyecto.id}`} className="btn-ver">
                      Ver detalles
                    </Link>
                    {isStaff() && (
                      <button 
                        className={proyecto.ganador ? 'btn-remover-ganador' : 'btn-marcar-ganador'}
                        onClick={() => handleToggleGanador(proyecto.id)}
                      >
                        {proyecto.ganador ? 'Quitar ganador' : 'Marcar ganador'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConvocatoriaDetail;