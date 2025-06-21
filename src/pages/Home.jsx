import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { convocatoriasService, proyectosService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [proyectosGanadores, setProyectosGanadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener convocatorias abiertas
        const convocatoriasResponse = await convocatoriasService.getAll();
        setConvocatorias(
          convocatoriasResponse.data.filter(conv => conv.abierta)
        );

        // Obtener proyectos ganadores
        const ganadoresResponse = await proyectosService.getGanadores();
        setProyectosGanadores(ganadoresResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>StartupFest: Tu plataforma de emprendimientos innovadores</h1>
        <p>Explora convocatorias abiertas y proyectos destacados</p>
        {!isAuthenticated() && (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
            <Link to="/login" className="btn btn-secondary">Iniciar sesión</Link>
          </div>
        )}
      </section>

      <section className="convocatorias-section">
        <h2>Convocatorias Abiertas</h2>
        <div className="items-grid">
          {convocatorias.length > 0 ? (
            convocatorias.map(convocatoria => (
              <div key={convocatoria.id} className="item-card">
                <h3>{convocatoria.titulo}</h3>
                <p>{convocatoria.descripcion.substring(0, 100)}...</p>
                <Link to={`/convocatorias/${convocatoria.id}`} className="btn btn-small">
                  Ver detalles
                </Link>
              </div>
            ))
          ) : (
            <p className="no-items">No hay convocatorias abiertas actualmente.</p>
          )}
        </div>
        <Link to="/convocatorias" className="btn btn-link">Ver todas las convocatorias</Link>
      </section>

      <section className="ganadores-section">
        <h2>Proyectos Ganadores</h2>
        <div className="items-grid">
          {proyectosGanadores.length > 0 ? (
            proyectosGanadores.map(proyecto => (
              <div key={proyecto.id} className="item-card ganador">
                <span className="badge-ganador">Ganador</span>
                <h3>{proyecto.titulo}</h3>
                <p>{proyecto.descripcion.substring(0, 100)}...</p>
                <Link to={`/proyectos/${proyecto.id}`} className="btn btn-small">
                  Ver proyecto
                </Link>
              </div>
            ))
          ) : (
            <p className="no-items">Aún no hay proyectos ganadores.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
