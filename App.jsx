// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Contact from './contact';
import About from './about';
import './index.css';
import { db } from './db';
import GalleryItem from './GalleryItem';

function App() {
  const [activePage, setActivePage] = useState('empanadas');
  // Cambiar inicialización del carrito para leer de localStorage
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'js/jquery.parallax.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handlePagingClick = (page) => {
    setActivePage(page);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setShowCartDropdown(false);
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
    setShowCartDropdown(false);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // Filtra los productos de la base de datos por categoría
  const empanadasData = db.filter(item => item.category === 'empanadas');
  const salsasData = db.filter(item => item.category === 'salsas');

  // Calcular el total del carrito
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleCopyAlias = () => {
    const alias = 'laredonda.sabrosa'; // Aquí puedes cambiar el alias si es necesario
    navigator.clipboard.writeText(alias).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000); // Oculta el mensaje después de 2 segundos
    });
  };
  return (
    <Router>
      <>
        <div className="container">
          <div>
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
                      <div className="tm-header-bar">
                        <ul className="tm-nav-ul">
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
          </div>

          <main>
            <Routes>
              {/* Home Page */}
              <Route
                path="/"
                element={
                  <>
                    <header className="row tm-welcome-section">
                      <h2 className="col-12 text-center tm-section-title">Bienvenido a La Redonda Sabrosa</h2>
                      <p className="col-12 text-center">El lugar donde encontraras las empanadas mas ricas de Villa Carlos Paz.</p>
                    </header>

                    <div className="tm-paging-links">
                      <nav>
                        <ul>
                          <li className="tm-paging-item">
                            <a
                              href="#"
                              className={`tm-paging-link ${activePage === 'empanadas' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePagingClick('empanadas');
                              }}
                            >
                              Empanadas
                            </a>
                          </li>
                          <li className="tm-paging-item">
                            <a
                              href="#"
                              className={`tm-paging-link ${activePage === 'salsas' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePagingClick('salsas');
                              }}
                            >
                              Salsas
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>

                    <div className="row tm-gallery">
                      {/* Galería de Empanadas */}
                      <div
                        id="tm-gallery-page-empanadas"
                        className={`tm-gallery-page ${activePage === 'empanadas' ? '' : 'hidden'}`}
                      >
                        {empanadasData.map((empanada) => (
                          <GalleryItem
                            key={empanada.id}
                            item={empanada}
                            addToCart={addToCart}
                          />
                        ))}
                      </div>

                      {/* Galería de Salsas */}
                      <div
                        id="tm-gallery-page-salsas"
                        className={`tm-gallery-page ${activePage === 'salsas' ? '' : 'hidden'}`}
                      >
                        {salsasData.map((salsa) => (
                          <GalleryItem
                            key={salsa.id}
                            item={salsa}
                            addToCart={addToCart}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>

          <footer className="tm-footer text-center">
            <div className="tm-social">
              <a href="https://instagram.com/la.redonda_sabrosa" target="_blank" className="tm-social-link" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/5493541230992" target="_blank" className="tm-social-link" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="mailto:laredondasabrosa@gmail.com" className="tm-social-link">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            <p>
              Copyright &copy; 2020 Simple House | Design:{' '}
              <a rel="nofollow" href="https://templatemo.com">
                TemplateMo
              </a>
            </p>
          </footer>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <span className="close-modal-btn" onClick={closePaymentModal}>&times;</span>
              <h4 className="text-center">Detalles del Pago</h4>
              <p>Monto Total: <strong>${cartTotal.toLocaleString('es-AR')}</strong></p>
              <hr />
              <div className="payment-details">
                <p>Por favor, realiza la transferencia a los siguientes datos:</p>

                <div className="alias-info-box">
                  <p className="alias-label">Alias:</p>
                  <div className="alias-group">
                    <strong className="alias-text">laredonda.sabrosa</strong>
                    <button className="copy-alias-btn" onClick={handleCopyAlias}>
                      <img src="/copiar.png" alt="Copiar Alias" />
                    </button>
                  </div>
                  {showCopySuccess && <span className="copy-success-message">¡Copiado!</span>}
                </div>
              </div>
              <p className="text-center">
                Una vez realizado el pago, envíanos el comprobante por{' '}
                <a
                  href={`https://wa.me/5493541230992?text=${encodeURIComponent(
                    `Hola, realicé una compra en La Redonda Sabrosa.\nMonto: $${cartTotal.toLocaleString('es-AR')}\nProductos:\n${cart
                      .map((item) => `- ${item.name} x${item.quantity} ($${item.price.toLocaleString('es-AR')})`)
                      .join('\n')}\nAlias de pago: laredonda.sabrosa`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-green"
                  style={{ fontWeight: 'bold', textDecoration: 'none' }}
                  onClick={closePaymentModal}
                >
                  WhatsApp
                </a>
                .
              </p>
              <div className="cart-buttons">
                <button className="btn-cerrar btn-cerrar:hover" onClick={closePaymentModal}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </>
    </Router>
  );
}

export default App;