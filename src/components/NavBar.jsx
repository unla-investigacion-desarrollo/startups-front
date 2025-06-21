import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, LogIn, LogOut, User } from 'lucide-react'; // opcional
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isStaff } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">StartupFest</Link>
      </div>
      <div className="navbar-links">
        <Link to="/convocatorias">Convocatorias</Link>
        
        {/* Enlaces para usuarios autenticados */}
        {currentUser ? (
          <>
            <Link to="/mis-proyectos">Mis Proyectos</Link>
            <Link to="/crear-proyecto">Crear Proyecto</Link>
            
            {/* Enlaces para staff/admin */}
            {isStaff() && (
              <Link to="/crear-convocatoria">Crear Convocatoria</Link>
            )}
            
            {/* Enlaces solo para admin */}
            {isAdmin() && (
              <Link to="/admin">Panel Admin</Link>
            )}
            
            <span className="user-welcome">Hola, {currentUser.nombre}</span>
            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
