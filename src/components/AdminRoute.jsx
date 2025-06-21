import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children, adminOnly = false }) => {
  const { isAdmin, isStaff, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si se requiere solo admin y el usuario no es admin, redirigir
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere staff o admin y el usuario no es ninguno, redirigir
  if (!isStaff()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;