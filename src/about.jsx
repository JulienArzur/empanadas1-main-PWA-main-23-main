// src/about.jsx
import React from 'react';
import './index.css';

export default function About() {
  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
      <h2 className="text-center tm-section-title">Sobre Nosotros</h2>
      <p className="text-center">
        Somos La Redonda Sabrosa, un proyecto escolar con pasión por las empanadas auténticas y los sabores de nuestra tierra.
        Nacimos en Villa Carlos Paz con el sueño de ofrecer un producto casero, de calidad y lleno de tradición.
        Cada empanada es hecha con dedicación, utilizando ingredientes frescos y recetas que han pasado de generación en generación.
        Este proyecto fue desarrollado como parte de un trabajo escolar para el Colegio Remedios, bajo la guía del profesor Luciano Lugani.
      </p>
      <div className="tm-persons">
        <div className="tm-person">
          <div className="tm-person-description">
            <h4 className="tm-person-name">Julien Arzur</h4>
            <p className="tm-person-title">Fundador y Chef Principal</p>
            <p className="tm-person-about">
              Julien es el corazón de La Redonda Sabrosa. Su amor por la gastronomía y su habilidad para combinar sabores son la base de nuestras empanadas.
            </p>
          </div>
        </div>
        <div className="tm-person">
          <div className="tm-person-description">
            <h4 className="tm-person-name">Jano Bustamante</h4>
            <p className="tm-person-title">Fundador y Gerente de Operaciones</p>
            <p className="tm-person-about">
              Jano asegura que cada pedido llegue a tiempo y que la calidad de nuestros productos sea siempre constante. Su eficiencia y compromiso son clave para nuestra operación diaria.
            </p>
          </div>
        </div>
      </div>
      <div className="tm-history">
        <h3 className="tm-history-title">Nuestra Historia</h3>
        <div className="tm-history-inner">
          <img src="/image-removebg-preview.png" alt="Nuestra Historia" className="tm-history-img" />
          <div className="tm-history-text">
            <p className="tm-history-description">
              La Redonda Sabrosa comenzó en la cocina de Julien, experimentando con las recetas de la abuela.
              Lo que empezó como un pasatiempo, se convirtió en un emprendimiento que hoy deleita a muchos en Carlos Paz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}