import React from 'react';
import { Link } from 'react-router-dom';
// Si quieres usar los iconos de lucide-react, debes instalarlos:
// npm install lucide-react
import { Home, Plus, LogIn } from 'lucide-react';

function Navbar() {
  return (
    <nav className="sidebar">
      <Link to="/"><Home size={24} /><span>INICIO</span></Link>
      <Link to="/createpost"><Plus size={24} /><span>POST</span></Link>
      <Link to="/login"><LogIn size={24} /><span>LOGIN</span></Link>
    </nav>
  );
}

export default Navbar;