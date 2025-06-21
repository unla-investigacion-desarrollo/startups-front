import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/me', {
          credentials: 'include'
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        navigate('/login');
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ title, content, published })
      });

      if (response.ok) {
        alert('Post creado correctamente');
        navigate('/');
      } else {
        const error = await response.json();
        alert(`Error al crear post: ${error.message}`);
      }
    } catch (err) {
      console.error('Error al crear post:', err);
      alert('Error en la conexión');
    }
  };

  if (!isLoggedIn) return <p className="loading-message">Verificando sesión...</p>;

  return (
    <div className="form-container">
      <h2>Crear Nueva Publicación</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Título de la publicación"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenido</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="8"
            placeholder="Escribí tu contenido aquí..."
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label htmlFor="published">Publicar inmediatamente</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Crear</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
