import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        alert('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error en la conexión');
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="form-card">
        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Nombre de usuario"
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Ingresar</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
  