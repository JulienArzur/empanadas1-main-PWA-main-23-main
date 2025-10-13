// src/pages/Login.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/config.js';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/productos');
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        alert("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else {
        alert("Ocurrió un error al intentar iniciar sesión.");
      }
    }
  };

  return (
    <div className="login-container">
      {/* ===== AQUÍ AGREGAMOS LA FLECHA Y EL ENLACE ===== */}
      <Link to="/" className="back-to-home-link">
        <i className="fas fa-arrow-left"></i> {/* Esto es el ícono de la flecha */}
        <span>Volver al Home</span>
      </Link>
      {/* ============================================== */}
      
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Acceso Administrador</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;