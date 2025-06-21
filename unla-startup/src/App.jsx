import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar'; 
import Login from './pages/Login'; 

import "./App.css";


function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;