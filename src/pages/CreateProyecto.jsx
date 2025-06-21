import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { proyectosService, convocatoriasService } from '../services/api';
import './CreateProyecto.css';

const CreateProyecto = () => {
  const [searchParams] = useSearchParams();
  const convocatoriaId = searchParams.get('convocatoria');
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contacto_email: '',
    contacto_campus: '',
    convocatoriaId: convocatoriaId || ''
  });
  
  const [convocatorias, setConvocatorias] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        const { data } = await convocatoriasService.getAll();
        // Filtrar solo convocatorias abiertas
        const convocatoriasAbiertas = data.filter(conv => conv.abierta);
        setConvocatorias(convocatoriasAbiertas);
      } catch (error) {
        console.error('Error al cargar convocatorias:', error);
      }
    };

    fetchConvocatorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

    if (formData.contacto_email && !/\S+@\S+\.\S+/.test(formData.contacto_email)) {
      errors.contacto_email = 'El correo electrónico no es válido';
      isValid = false;
    }

    if (!formData.convocatoriaId) {
      errors.convocatoriaId = 'Debes seleccionar una convocatoria';
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
      await proyectosService.create(formData);
      
      // Redirigir a la página de la convocatoria
      navigate(`/convocatorias/${formData.convocatoriaId}`);
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      setSubmitError(error.response?.data?.message || 'Error al crear el proyecto. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-proyecto-container">
      <h1>Crear Nuevo Proyecto</h1>

      {submitError && <div className="error-message">{submitError}</div>}

      {convocatorias.length === 0 && (
        <div className="info-message">
          No hay convocatorias abiertas actualmente para presentar proyectos.
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="titulo">Título del proyecto *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={formErrors.titulo ? 'input-error' : ''}
            disabled={convocatorias.length === 0}
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
            rows="8"
            disabled={convocatorias.length === 0}
            required
          ></textarea>
          {formErrors.descripcion && <span className="error">{formErrors.descripcion}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contacto_email">Email de contacto</label>
          <input
            type="email"
            id="contacto_email"
            name="contacto_email"
            value={formData.contacto_email}
            onChange={handleChange}
            className={formErrors.contacto_email ? 'input-error' : ''}
            placeholder="ejemplo@correo.com"
            disabled={convocatorias.length === 0}
          />
          {formErrors.contacto_email && <span className="error">{formErrors.contacto_email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contacto_campus">Usuario de Campus</label>
          <input
            type="text"
            id="contacto_campus"
            name="contacto_campus"
            value={formData.contacto_campus}
            onChange={handleChange}
            placeholder="@usuario"
            disabled={convocatorias.length === 0}
          />
        </div>

        <div className="form-group">
          <label htmlFor="convocatoriaId">Convocatoria *</label>
          <select
            id="convocatoriaId"
            name="convocatoriaId"
            value={formData.convocatoriaId}
            onChange={handleChange}
            className={formErrors.convocatoriaId ? 'input-error' : ''}
            disabled={convocatorias.length === 0}
            required
          >
            <option value="">Selecciona una convocatoria</option>
            {convocatorias.map(conv => (
              <option key={conv.id} value={conv.id}>
                {conv.titulo}
              </option>
            ))}
          </select>
          {formErrors.convocatoriaId && <span className="error">{formErrors.convocatoriaId}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting || convocatorias.length === 0}
          >
            {isSubmitting ? 'Creando...' : 'Crear Proyecto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProyecto;