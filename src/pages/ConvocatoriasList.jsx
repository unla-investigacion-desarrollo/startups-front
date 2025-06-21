import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { convocatoriasService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConvocatoriaCard from '../components/ConvocatoriaCard';
import './ConvocatoriasList.css';

const ConvocatoriasList = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'abiertas', 'cerradas'
  const { isStaff } = useAuth();

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setLoading(true);
        const { data } = await convocatoriasService.getAll();
        setConvocatorias(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar convocatorias:', err);
        setError('No se pudieron cargar las convocatorias. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchConvocatorias();
  }, []);

  const handleToggleAbierta = async (id) => {
    try {
      await convocatoriasService.toggleAbierta(id);
      setConvocatorias(prevState => 
        prevState.map(conv => 
          conv.id === id ? { ...conv, abierta: !conv.abierta } : conv
        )
      );
    } catch (err) {
      console.error('Error al cambiar estado de la convocatoria:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta convocatoria?')) {
      try {
        await convocatoriasService.delete(id);
        setConvocatorias(prevState => prevState.filter(conv => conv.id !== id));
      } catch (err) {
        console.error('Error al eliminar convocatoria:', err);
      }
    }
  };

  const convocatoriasFiltradas = convocatorias.filter(conv => {
    if (filtro === 'todas') return true;
    if (filtro === 'abiertas') return conv.abierta;
    if (filtro === 'cerradas') return !conv.abierta;
    return true;
  });

  if (loading) {
    return <div className="loading">Cargando convocatorias...</div>;
  }
  return (
    <div className="convocatorias-list-container">
      <div className="convocatorias-header">
        <h1>Convocatorias</h1>
        {isStaff() && (
          <Link to="/crear-convocatoria" className="btn-crear">
            Crear Nueva Convocatoria
          </Link>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filtros">
        <span>Filtrar por: </span>
        <button 
          className={filtro === 'todas' ? 'active' : ''} 
          onClick={() => setFiltro('todas')}
        >
          Todas
        </button>
        <button 
          className={filtro === 'abiertas' ? 'active' : ''} 
          onClick={() => setFiltro('abiertas')}
        >
          Abiertas
        </button>
        <button 
          className={filtro === 'cerradas' ? 'active' : ''} 
          onClick={() => setFiltro('cerradas')}
        >
          Cerradas
        </button>
      </div>

      {convocatoriasFiltradas.length === 0 ? (
        <p className="no-items">No hay convocatorias disponibles con los filtros seleccionados.</p>
      ) : (
        <div className="convocatorias-grid">
          {convocatoriasFiltradas.map(convocatoria => (
            <ConvocatoriaCard
              key={convocatoria.id}
              convocatoria={convocatoria}
              onToggle={handleToggleAbierta}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvocatoriasList;