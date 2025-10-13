  // src/contact.jsx
  import React from 'react';
  import './index.css';
  export default function Contact() {
    return (
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <h2 className="text-center tm-section-title">Contáctanos</h2>
        <div className="row tm-contact-section">

          <div className="col-md-6 alling-center">
            <div className="tm-address-box">
              <h4 className="tm-info-title">Nuestra Dirección</h4>
              <address>
                Av. Libertad 1234, <br />
                Villa Carlos Paz, Córdoba, <br />
                Argentina
              </address>
              <a href="tel:03541123456" className="tm-contact-link">
                <i className="fas fa-phone tm-contact-icon"></i>3541 230992
              </a>
              <a href="mailto:info@laredondasabrosa.com" className="tm-contact-link">
                <i className="fas fa-envelope tm-contact-icon"></i>laredondasabrosa@gmail.com
              </a>
              <div className="tm-contact-social">
                <a href="https://instagram.com/la.redonda_sabrosa" target="_blank" className="tm-social-link" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://wa.me/5493541230992" target="_blank" className="tm-social-link" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="tm-map-section">
          <div id="google-map" className="tm-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3406.8288860714243!2d-64.49258272365287!3d-31.401131774261765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d66574f26034f%3A0xc3e18f2f211d0d93!2sVilla%20Carlos%20Paz%2C%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1717983600000!5m2!1ses-419!2sar"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de La Redonda Sabrosa"
            ></iframe>
          </div>
        </div>
      </div>
    );
  }