import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, LogIn, LogOut, User } from 'lucide-react'; // opcional

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

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
    <nav className="sidebar">
      <Link to="/"><Home size={24} /><span>INICIO</span></Link>
      <Link to="/createpost"><Plus size={24} /><span>POST</span></Link>
      {!user ? (
        <Link to="/login"><LogIn size={24} /><span>LOGIN</span></Link>
      ) : (
        <>
          <span><User size={24} /></span>
          <button onClick={handleLogout}><LogOut size={24} /><span>LOGOUT</span></button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
