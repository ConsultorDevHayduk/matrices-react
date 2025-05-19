import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'

const Register = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    idUsuario: '',
    nombre: '',
    password: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
      const savedToken = localStorage.getItem("token");
      const exp = localStorage.getItem("token_exp");
  
      if (!savedToken || Date.now() > parseInt(exp)) {
        navigate("/");
      } else {
        setToken(savedToken);
      }
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.idUsuario) {
      newErrors.idUsuario = 'ID de usuario es requerido';
    } else if (!/^\d{8,}$/.test(formData.idUsuario)) {
      newErrors.idUsuario = 'El ID debe tener al menos 8 dígitos';
    }
    
    if (!formData.nombre) {
      newErrors.nombre = 'Nombre completo es requerido';
    } else if (formData.nombre.length < 5) {
      newErrors.nombre = 'Nombre demasiado corto';
    }
    
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch("http://matrix-auth-api-env.eba-psneaguu.us-east-2.elasticbeanstalk.com/user/register", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error en el registro');
        }

        setSuccessMessage('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/Home'), 2000);
        
      } catch (error) {
        console.error('Registration error:', error);
        setErrors(prev => ({
          ...prev,
          server: error.message || 'Error al registrar el usuario'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {errors.server && (
          <div className="error-message">{errors.server}</div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="idUsuario">ID de Usuario</label>
            <input
              type="text"
              id="idUsuario"
              name="idUsuario"
              value={formData.idUsuario}
              onChange={handleChange}
              className={errors.idUsuario ? 'error-input' : ''}
              placeholder="Ej: 12345678"
              maxLength="20"
            />
            {errors.idUsuario && (
              <span className="error-text">{errors.idUsuario}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error-input' : ''}
              placeholder="Ej: Diego Mendoza"
            />
            {errors.nombre && (
              <span className="error-text">{errors.nombre}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
              placeholder="Ej: diegoxesfc@gmail.com"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;