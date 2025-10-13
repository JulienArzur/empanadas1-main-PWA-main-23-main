// src/CartPanel.jsx

import React from 'react';
import './index.css';

const CartPanel = ({
  isOpen,
  onClose,
  cart,
  cartTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  handlePurchase, // Renombramos para claridad
}) => {
  return (
    <div className={`cart-panel-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-panel-header">
          <h3>Tu Carrito</h3>
          <span className="close-panel-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="cart-panel-body">
          {cart.length === 0 ? (
            <p className="empty-cart-message">El carrito está vacío.</p>
          ) : (
            <table className="cart-panel-table">
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td><img src={item.image} alt={item.name} className="cart-item-img" /></td>
                    <td>
                      {item.name}
                      {item.isPromo && <span className="cart-item-details">{item.details}</span>}
                    </td>
                    <td>
                      <div className="quantity-controls">
                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toLocaleString('es-AR')}</td>
                    <td><button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-panel-footer">
            <div className="cart-total-section">
              <span>Total:</span>
              <strong>${cartTotal.toLocaleString('es-AR')}</strong>
            </div>
            <button className="btn-agregar checkout-btn" onClick={handlePurchase}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPanel;