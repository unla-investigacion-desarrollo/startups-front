import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await userService.getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('No se pudieron cargar los usuarios. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdateSuccess('');
      await userService.updateUserRole(userId, newRole);
      
      // Actualizar la lista de usuarios en el estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, rol: newRole } : user
        )
      );
      
      setUpdateSuccess(`Rol actualizado correctamente para el usuario ID: ${userId}`);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setUpdateSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      setError('Error al actualizar el rol del usuario. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="admin-panel-container">
      <h1>Panel de Administración</h1>
      
      {error && <div className="error-message">{error}</div>}
      {updateSuccess && <div className="success-message">{updateSuccess}</div>}
      
      <div className="admin-section">
        <h2>Gestión de Usuarios</h2>
        
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.rol.toLowerCase()}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>{new Date(user.creado_en).toLocaleDateString()}</td>
                    <td>
                      <div className="role-actions">
                        <select 
                          value={user.rol}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="FINAL">FINAL</option>
                          <option value="STAFF">STAFF</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;