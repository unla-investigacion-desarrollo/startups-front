import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ConvocatoriasList from './pages/ConvocatoriasList';
import ConvocatoriaDetail from './pages/ConvocatoriaDetail';
import CreateConvocatoria from './pages/CreateConvocatoria';
import ProyectoDetail from './pages/ProyectoDetail';
import CreateProyecto from './pages/CreateProyecto';
import MisProyectos from './pages/MisProyectos';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/convocatorias" element={<ConvocatoriasList />} />
          <Route path="/convocatorias/:id" element={<ConvocatoriaDetail />} />
          <Route path="/proyectos/:id" element={<ProyectoDetail />} />
          
          {/* Rutas protegidas - requieren autenticación */}
          <Route path="/crear-proyecto" element={
            <PrivateRoute>
              <CreateProyecto />
            </PrivateRoute>
          } />
          <Route path="/mis-proyectos" element={
            <PrivateRoute>
              <MisProyectos />
            </PrivateRoute>
          } />
          
          {/* Rutas solo para staff/admin */}
          <Route path="/crear-convocatoria" element={
            <AdminRoute>
              <CreateConvocatoria />
            </AdminRoute>
          } />
          
          {/* Rutas solo para admin */}
          <Route path="/admin" element={
            <AdminRoute adminOnly={true}>
              <AdminPanel />
            </AdminRoute>
          } />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App; 
