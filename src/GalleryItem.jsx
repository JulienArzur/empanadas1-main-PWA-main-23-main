// src/GalleryItem.jsx
import React from 'react';

export default function GalleryItem({ item, addToCart }) {
  const { name, image, description, price, unit, stock } = item; // <-- Agregamos 'stock'

  const handleAddToCart = () => {
    // Solo agregar al carrito si hay stock
    if (stock > 0) {
      addToCart(item);
    }
  };

  const isOutOfStock = stock <= 0; // Creamos una variable para saber si no hay stock

  return (
    <article className="col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item">
      <figure>
        <img
          src={item.image.startsWith('/') ? item.image : '/' + item.image}
          alt={name}
          className={`img-fluid tm-gallery-img ${isOutOfStock ? 'out-of-stock-img' : ''}`} // Clase si no hay stock
        />
        <figcaption>
          <h4 className="tm-gallery-title">{name}</h4>
          <p className="tm-gallery-description">
            {description}
          </p>
          <p className="tm-gallery-price">${price.toLocaleString('es-AR')}{unit}</p>

          {/* ===== LÓGICA DEL BOTÓN POR STOCK ===== */}
          {isOutOfStock ? (
            <button
              className="btn-agregar btn-out-of-stock"
              disabled // El botón está desactivado
            >
              No disponible
            </button>
          ) : (
            <button
              className="btn-agregar btn-agregar:hover"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
          )}
          {/* ======================================= */}

        </figcaption>
      </figure>
    </article>
  );
}