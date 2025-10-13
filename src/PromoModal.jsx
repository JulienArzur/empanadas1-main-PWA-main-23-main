// src/PromoModal.jsx

import React, { useState } from 'react';
import './index.css';

const PromoModal = ({ isOpen, onClose, promo, empanadas, onAddToCart }) => {
  const [selection, setSelection] = useState({}); // { 'Empanada Salteña': 2, 'Empanada Caprese': 4 }
  const totalSelected = Object.values(selection).reduce((sum, count) => sum + count, 0);

  if (!isOpen) return null;

  const handleSelect = (empanadaName, change) => {
    const currentCount = selection[empanadaName] || 0;
    const newCount = currentCount + change;

    if (newCount >= 0) {
      if (totalSelected + change <= promo.quantity) {
        setSelection(prev => ({
          ...prev,
          [empanadaName]: newCount,
        }));
      } else {
        alert(`No puedes seleccionar más de ${promo.quantity} empanadas.`);
      }
    }
  };

  const handleAddToCartClick = () => {
    if (totalSelected < promo.quantity) {
      alert(`Debes seleccionar ${promo.quantity} empanadas para completar la promoción.`);
      return;
    }
    onAddToCart(promo, selection);
    setSelection({}); // Reset selection
    onClose();
  };

  return (
    <div className="promo-modal-overlay">
      <div className="promo-modal">
        <span className="close-modal-btn" onClick={onClose}>&times;</span>
        <h3>Elige tus Empanadas para la {promo.name}</h3>
        <p className="promo-modal-counter">
          Seleccionadas: <strong>{totalSelected}</strong> de <strong>{promo.quantity}</strong>
        </p>

        <div className="promo-modal-list">
          {empanadas.map(empanada => (
            <div key={empanada.id} className="promo-modal-item">
              <span>{empanada.name}</span>
              <div className="quantity-controls">
                <button onClick={() => handleSelect(empanada.name, -1)}>-</button>
                <span>{selection[empanada.name] || 0}</span>
                <button onClick={() => handleSelect(empanada.name, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="btn-agregar add-promo-btn" 
          onClick={handleAddToCartClick}
          disabled={totalSelected !== promo.quantity}
        >
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

export default PromoModal;