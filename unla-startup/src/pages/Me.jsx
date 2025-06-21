import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Me() {
  // Estados para almacenar la información del usuario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [creado_en, setCreado_en] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Función para formatear la fecha
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Si no hay usuario, redirigir al login
      navigate('/login');
      return;
    }

    // Función para obtener los datos del usuario actual
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Importante para enviar cookies de sesión
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener la información del usuario');
        }

        const data = await response.json();
        console.log("Datos del usuario:", data);
        
        // Actualizar los estados con la información del usuario
        setNombre(data.user.nombre);
        setEmail(data.user.email);
        setRol(data.user.rol);
        setCreado_en(data.user.creado_en);
        setError(null);
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login si hay un error de autenticación
        // navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div className="loading-message">Cargando información del usuario...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main-content">
      <h1>Mi Perfil</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <h2>Nombre de usuario:{nombre}</h2>
          <span className={`role-badge role-${rol.toLowerCase()}`}>{rol}</span>
        </div>
        
        <div className="profile-details">
          <div className="profile-item">
            <strong>Email:</strong>
            <span>{email}</span>
          </div>
          
          <div className="profile-item">
            <strong>Rol:</strong>
            <span>{rol}</span>
          </div>
          
          <div className="profile-item">
            <strong>Miembro desde:</strong>
            <span>{formatearFecha(creado_en)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Me;