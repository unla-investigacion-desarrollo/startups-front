import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';

import "./App.css";


function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createpost" element={<CreatePost />} />
      </Routes>
    </div>
  );
}

export default App; 
