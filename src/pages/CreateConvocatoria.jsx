import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convocatoriasService } from '../services/api';
import './CreateConvocatoria.css';

const CreateConvocatoria = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    abierta: true
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar error del campo cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.titulo || formData.titulo.trim() === '') {
      errors.titulo = 'El título es obligatorio';
      isValid = false;
    }

    if (!formData.descripcion || formData.descripcion.trim() === '') {
      errors.descripcion = 'La descripción es obligatoria';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await convocatoriasService.create(formData);
      navigate('/convocatorias');
    } catch (error) {
      console.error('Error al crear convocatoria:', error);
      setSubmitError(error.response?.data?.message || 'Error al crear la convocatoria. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-convocatoria-container">
      <h1>Crear Nueva Convocatoria</h1>

      {submitError && <div className="error-message">{submitError}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="titulo">Título de la convocatoria *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={formErrors.titulo ? 'input-error' : ''}
            required
          />
          {formErrors.titulo && <span className="error">{formErrors.titulo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={formErrors.descripcion ? 'input-error' : ''}
            rows="10"
            required
          ></textarea>
          {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="abierta"
              checked={formData.abierta}
              onChange={handleChange}
            />
            Convocatoria abierta para proyectos
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/convocatorias')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Convocatoria'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateConvocatoria;