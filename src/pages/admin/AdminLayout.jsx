// src/pages/admin/AdminLayout.jsx

import React from 'react';
// Importamos Link y NavLink
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase/config.js';
import '../../index.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
           <h1>Panel de Administración</h1>
            <nav className="admin-nav">
              <NavLink to="/admin/productos">Gestión de Productos</NavLink>
              <NavLink to="/admin/ventas">Control de Ventas</NavLink>
            </nav>
        </div>
       
        <div className="admin-header-right">
            {/* ===== AQUÍ AGREGAMOS EL BOTÓN ===== */}
            <Link to="/" className="admin-view-store-btn">Ver Tienda</Link>
            {/* ==================================== */}
            <button onClick={handleLogout} className="admin-logout-btn">Cerrar Sesión</button>
        </div>
      </header>
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;