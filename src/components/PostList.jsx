import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComments, setNewComments] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar el usuario desde localStorage
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  useEffect(() => {
    // Obtener todos los posts
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(async data => {
        console.log('Posts recibidos:', data);
        setPosts(data);
        
        // Para cada post, obtener sus comentarios
        const postsData = await Promise.all(
          data.map(async post => {
            try {
              const commentsRes = await fetch(`http://localhost:3000/api/comments/${post.id}`);
              const comments = await commentsRes.json();
              return { ...post, comments };
            } catch (err) {
              console.error(`Error al obtener comentarios para el post ${post.id}:`, err);
              return { ...post, comments: [] };
            }
          })
        );
        
        // Inicializar el estado de nuevos comentarios para cada post
        const initialCommentsState = {};
        data.forEach(post => {
          initialCommentsState[post.id] = '';
        });
        setNewComments(initialCommentsState);
        
        setPostsWithComments(postsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener posts:', err);
        setLoading(false);
      });
  }, []);

  const handleCommentChange = (postId, content) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: content
    }));
  };

  const handleAddComment = async (postId) => {
    if (!user) {
      // Si el usuario no está logueado, redirigir a login
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComments[postId] })
      });

      if (response.ok) {
        // Obtener los comentarios actualizados
        const commentsRes = await fetch(`http://localhost:3000/api/comments/${postId}`);
        const updatedComments = await commentsRes.json();
        
        // Actualizar el estado con los nuevos comentarios
        setPostsWithComments(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, comments: updatedComments } 
              : post
          )
        );
        
        // Limpiar el campo de comentario
        setNewComments(prev => ({
          ...prev,
          [postId]: ''
        }));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      alert('Error de conexión al agregar comentario');
    }
  };

  if (loading) {
    return <div>Cargando posts y comentarios...</div>;
  }

  return (
  <div>
    {postsWithComments.map(post => (
      <div key={post.id} className="post-card">
        <h3>{post.title}</h3>
        <p className="post-meta">
          <em>{post.username}</em> — {new Date(post.created_at).toLocaleString()}
        </p>
        <p>{post.content}</p>

        <div className="comment-section">
          <h4>Comentarios ({post.comments?.length || 0})</h4>
          {post.comments.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                <small>Por: {comment.username} - {new Date(comment.created_at).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>No hay comentarios aún.</p>
          )}

          <textarea
            value={newComments[post.id]}
            onChange={(e) => handleCommentChange(post.id, e.target.value)}
            placeholder="Escribe tu comentario"
            rows="3"
          />
          <button 
            onClick={() => handleAddComment(post.id)} 
            disabled={!newComments[post.id].trim()}
          >
            Comentar
          </button>
          {!user && (
            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
              Debes iniciar sesión para comentar
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

}

export default PostList;