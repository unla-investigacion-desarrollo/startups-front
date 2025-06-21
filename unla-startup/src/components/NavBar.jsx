import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, LogIn, LogOut, User } from 'lucide-react';

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Función para actualizar el estado del usuario desde localStorage
  const updateUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear usuario:", e);
      }
    } else {
      setUser(null);
    }
  };
  
  useEffect(() => {
    // Cargar usuario al montar el componente
    updateUserFromStorage();
    
    // Escuchar cambios en localStorage (desde otras pestañas)
    window.addEventListener('storage', updateUserFromStorage);
    
    // Escuchar el evento de login personalizado (desde la misma pestaña)
    window.addEventListener('userLogin', updateUserFromStorage);
    
    // Cleanup al desmontar
    return () => {
      window.removeEventListener('storage', updateUserFromStorage);
      window.removeEventListener('userLogin', updateUserFromStorage);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  console.log("Estado actual del usuario:", user);

  return (
    <nav className="sidebar">
      <Link to="/"><Home size={24} /><span>INICIO</span></Link>
      <Link to="/proyectos"><Plus size={24} /><span>PROYECTO</span></Link>
      
      {!user ? (
        <Link to="/login"><LogIn size={24} /><span>LOGIN</span></Link>
      ) : (
        <>
          <Link to="/">
            <User size={24} />
            <span>Hola {user.nombre ? user.nombre.split(' ')[0] : 'Usuario'}</span>
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={24} />
            <span>LOGOUT</span>
          </button>
        </>
      )}
    </nav>
  );
}

export default NavBar;