// src/Header.jsx
  
import React from 'react';
import { Link } from 'react-router-dom';

// PASO 1: Usamos "export default" y recibimos todas las props necesarias desde App.jsx
export default function Header({ 
  cart, 
  showCartDropdown, 
  setShowCartDropdown, 
  removeFromCart, 
  decreaseQuantity, 
  increaseQuantity, 
  clearCart, 
  handleProceedToPayment,
  cartTotal,
  navbarRef
}) {

  return (
    // TU CÓDIGO JSX EXACTO, SIN NINGÚN CAMBIO
    <div className="placeholder">
      <div
        className="parallax-window"
        data-parallax="scroll"
        data-image-src="https://assets.elgourmet.com/wp-content/uploads/2023/03/cover_fpa6sn8vqc_empanadas.jpg"
      >
        <div className="tm-header">
          <div className="row tm-header-inner align-items-center">
            <div className="col-12 text-center">
              <div className="tm-site-text-box">
                <img src="/image-removebg-preview.png" alt="Logo de La Redonda Sabrosa" />
                <h6 className="tm-site-description">Por la pelota y la Empanada.</h6>
              </div>
            </div>

            <div className="col-12">
              <div className="tm-header-bar" ref={navbarRef}>
                <ul className="tm-nav-ul centered-nav">
                  <li className="tm-nav-li">
                    <Link to="/" className="tm-nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="tm-nav-li">
                    <Link to="/about" className="tm-nav-link">
                      Sobre Nosotros
                    </Link>
                  </li>
                  <li className="tm-nav-li">
                    <Link to="/contact" className="tm-nav-link">
                      Contacto
                    </Link>
                  </li>
                </ul>
                <div className="cart-icon" onClick={() => setShowCartDropdown(!showCartDropdown)}>
                  <img src="/cart-icon.png" alt="Carrito" />
                  {cart.length > 0 && <span className="cart-count">{cart.reduce((total, item) => total + (item.quantity || 1), 0)}</span>}
                  {showCartDropdown && (
                    <div className="cart-dropdown">
                      <h4 className="text-center">Tu Carrito</h4>
                      {cart.length === 0 ? (
                        <p className="text-center">El carrito está vacío.</p>
                      ) : (
                        <>
                          <table className="cart-table">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cant.</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {cart.map((item) => (
                                <tr key={item.id}>
                                  <td>
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                  </td>
                                  <td>{item.name}</td>
                                  <td>${item.price.toLocaleString('es-AR')}</td>
                                  <td>
                                    <div className="quantity-controls">
                                      <button onClick={(e) => { e.stopPropagation(); decreaseQuantity(item.id); }}>-</button>
                                      <span>{item.quantity}</span>
                                      <button onClick={(e) => { e.stopPropagation(); increaseQuantity(item.id); }}>+</button>
                                    </div>
                                  </td>
                                  <td>
                                    <button className="remove-item-btn" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>X</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p className="cart-total">Total: ${cartTotal.toLocaleString('es-AR')}</p>
                          <div className="cart-actions">
                            <button className="btn-agregar" onClick={(e) => { e.stopPropagation(); clearCart(); }}>Vaciar Carrito</button>
                            <button className="btn-agregar" onClick={(e) => { e.stopPropagation(); handleProceedToPayment(); }}>Proceder al pago</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}