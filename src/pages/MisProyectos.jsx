import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { proyectosService } from '../services/api';
import ProyectoCard from '../components/ProyectoCard';
import './MisProyectos.css';

const MisProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        setLoading(true);
        const { data } = await proyectosService.getMisProyectos();
        setProyectos(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        setError('No se pudieron cargar tus proyectos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await proyectosService.delete(id);
        setProyectos(prevState => prevState.filter(proyecto => proyecto.id !== id));
      } catch (err) {
        console.error('Error al eliminar el proyecto:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando tus proyectos...</div>;
  }

  return (
    <div className="mis-proyectos-container">
      <div className="mis-proyectos-header">
        <h1>Mis Proyectos</h1>
        <Link to="/crear-proyecto" className="btn-crear">
          Nuevo Proyecto
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}      {proyectos.length === 0 ? (
        <div className="no-proyectos">
          <p>Aún no has creado ningún proyecto.</p>
          <Link to="/crear-proyecto" className="btn-empezar">
            Crear mi primer proyecto
          </Link>
        </div>
      ) : (
        <div className="proyectos-grid">
          {proyectos.map(proyecto => (
            <ProyectoCard
              key={proyecto.id}
              proyecto={proyecto}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisProyectos;