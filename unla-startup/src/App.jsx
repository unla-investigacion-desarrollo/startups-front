import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'; 
import Login from './pages/Login';
import Me from './pages/Me'; 

import "./App.css";

// Componente simple para la página de inicio
const Home = () => (
  <div className="main-content">
    <h1>Bienvenido a UNLa Startups</h1>
    <p>Plataforma para la gestión de proyectos de emprendimiento</p>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<Me />} /> 
      </Routes>
    </div>
  );
}

export default App;