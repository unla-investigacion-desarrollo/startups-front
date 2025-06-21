import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, LogIn, LogOut, User } from 'lucide-react';

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Comprobar si hay un usuario en localStorage al montar el componente
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Actualizamos el endpoint según tu test.http
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

  return (
    <nav className="sidebar">
      <Link to="/"><Home size={24} /><span>INICIO</span></Link>
      <Link to="/"><Plus size={24} /><span>PROYECTO</span></Link>
      
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