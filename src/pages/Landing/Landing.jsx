import styles from "./Landing.module.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react';
const Landing = ({ start }) => {
  const navigate = useNavigate();
   const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password debe tener al menos 5 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      try {
  
  const response = await fetch("http://matrix-auth-api-env.eba-psneaguu.us-east-2.elasticbeanstalk.com/security/login", {
    method: "POST",
    mode: 'no-cors',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
        if (response.status==200) {
           localStorage.setItem("token", data.token); // guarda JWT
           localStorage.setItem("token_exp", Date.now() + 3600 * 1000); // 1 hora
          navigate("/Home");
        }else{
          alert("Credenciales Invalidas")
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors(prev => ({
          ...prev,
          server: 'Credenciales Invalidas'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  

  return (
    <div className={styles.container}>
      <div className={styles.pokeball}>
         <h1 className={styles.title}>Welcome to Matriz App</h1>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {errors.server && (
            <div className={styles.error}>{errors.server}</div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
