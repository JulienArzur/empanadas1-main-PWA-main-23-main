// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Contact from './contact';
import About from './about';
import './index.css';

import { db } from './firebase/config.js';
import { collection, getDocs, doc, writeBatch, increment, addDoc, Timestamp } from "firebase/firestore";

import GalleryItem from './GalleryItem';
import Login from './pages/Login';
import ProductManager from './pages/admin/ProductManager';
import SalesDashboard from './pages/admin/SalesDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import PromoModal from './PromoModal';
import CartPanel from './CartPanel';
import QRScanner from './QRScanner';


function App() {
  const [activePage, setActivePage] = useState('empanadas');
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const navbarRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const fetchProductsFromFirebase = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error al cargar productos desde Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductsFromFirebase();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;
      const rect = navbarRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('.cart-icon, .cart-close-icon');
      if (rect.bottom < 0) {
        cartIcon?.classList.add('fixed-mobile');
      } else {
        cartIcon?.classList.remove('fixed-mobile');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'js/jquery.parallax.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  useEffect(() => {
    if (couponApplied) {
      const newDiscountAmount = cartTotal * 0.10;
      setDiscount(newDiscountAmount);
    }
  }, [cartTotal, couponApplied]);

  const handlePagingClick = (page) => {
    setActivePage(page);
  };

  const addToCart = (item) => {
    const productInStock = products.find(p => p.id === item.id);
    const itemsInCart = cart.find(cartItem => cartItem.id === item.id && !cartItem.isPromo)?.quantity || 0;
    if (productInStock && productInStock.stock > itemsInCart) {
      setCart((prevCart) => {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id && !cartItem.isPromo);
        if (existingItem) {
          return prevCart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
        }
        return [...prevCart, { ...item, quantity: 1 }];
      });
    } else {
      alert("No hay más stock disponible para este producto.");
    }
  };

  const increaseQuantity = (id) => {
    const itemInCart = cart.find(cartItem => cartItem.id === id);
    if (!itemInCart) return;

    if (itemInCart.isPromo) {
        alert("Para cambiar la promo, elimínala y vuelve a agregarla.");
        return;
    }
    
    const originalProductId = itemInCart.isDiscounted ? id.split('-')[0] : id;
    const productInStock = products.find(p => p.id === originalProductId);

    if (productInStock && productInStock.stock > itemInCart.quantity) {
      setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      alert("No hay más stock disponible para este producto.");
    }
  };

  const decreaseQuantity = (id) => {
    const itemInCart = cart.find(cartItem => cartItem.id === id);
    if (!itemInCart) return;
    
    if (itemInCart.isPromo && itemInCart.quantity === 1) {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
        return;
    }

    if (itemInCart.isDiscounted && itemInCart.quantity === 1) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
      return;
    }

    setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode('');
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };
  
  const handleCopyAlias = () => {
    const alias = 'laredonda.sabrosa';
    navigator.clipboard.writeText(alias).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    });
  };
  
  const finalTotal = cartTotal - discount;

  const handleApplyCoupon = () => {
    if (couponApplied) {
      alert("Ya has aplicado un cupón en esta compra.");
      return;
    }
    if (couponCode.toLowerCase() === 'expodescuento') {
      const discountAmount = cartTotal * 0.10;
      setDiscount(discountAmount);
      setCouponApplied(true);
      alert("¡Cupón del 10% aplicado con éxito!");
    } else {
      alert("El código del cupón no es válido.");
    }
  };

  const handlePurchaseAndStockUpdate = async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    setIsCartOpen(false);
    const batch = writeBatch(db);
    cart.forEach(item => {
      if (!item.isPromo) {
        const originalProductId = item.isDiscounted ? item.id.split('-')[0] : item.id;
        const productRef = doc(db, "products", originalProductId);
        batch.update(productRef, { stock: increment(-item.quantity) });
      }
    });
    try {
      await batch.commit();
      await addDoc(collection(db, "sales"), {
        createdAt: Timestamp.now(), items: cart, total: finalTotal,
        discountApplied: couponApplied, discountAmount: discount
      });
      setProducts(currentProducts => 
        currentProducts.map(p => {
          const itemInCart = cart.find(item => (item.isDiscounted ? item.id.split('-')[0] : item.id) === p.id && !item.isPromo);
          if (itemInCart) { return { ...p, stock: p.stock - itemInCart.quantity }; }
          return p;
        })
      );
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error al procesar la compra: ", error);
      alert("Hubo un problema al procesar tu pedido. Por favor, intenta de nuevo.");
    }
  };
  
  const handlePaymentConfirmation = () => {
    closePaymentModal();
    clearCart();
  };
  
  const handleOpenPromoModal = (promo) => {
    setSelectedPromo(promo);
    setIsPromoModalOpen(true);
  };

  const handleAddPromoToCart = (promo, selection) => {
    const promoDetails = Object.entries(selection).filter(([, quantity]) => quantity > 0).map(([name, quantity]) => `${name} x${quantity}`).join(', ');
    const promoInCart = {
      id: `${promo.name}-${Date.now()}`, name: promo.name, price: promo.price,
      quantity: 1, details: promoDetails, isPromo: true, image: '/image-removebg-preview.png'
    };
    setCart(prevCart => [...prevCart, promoInCart]);
  };
  
  const handleScan = (productId) => {
    setIsScannerOpen(false);
    const product = products.find(p => p.id === productId);

    if (!product || typeof product.price !== 'number') {
      alert("El código QR no es válido o el producto tiene un problema.");
      return;
    }
    
    const existingItem = cart.find(item => item.isDiscounted && item.id.startsWith(productId));
    
    if (existingItem) {
      increaseQuantity(existingItem.id);
    } else {
      const discountedPrice = product.price * 0.90;
      const itemInCart = {
        id: `${product.id}-${Date.now()}`, name: product.name || 'Producto sin nombre',
        image: product.image || '', price: discountedPrice,
        originalPrice: product.price, quantity: 1, isDiscounted: true,
      };
      setCart(prevCart => [...prevCart, itemInCart]);
    }
    
    setIsCartOpen(true);
  };

  const empanadasData = Array.isArray(products) ? products.filter(item => item.category === 'empanadas') : [];
  const salsasData = Array.isArray(products) ? products.filter(item => item.category === 'salsas') : [];
  
  return (
    <Router>
      <>
        <PromoModal 
          isOpen={isPromoModalOpen}
          onClose={() => setIsPromoModalOpen(false)}
          promo={selectedPromo}
          empanadas={empanadasData}
          onAddToCart={handleAddPromoToCart}
        />
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          cartTotal={cartTotal}
          finalTotal={finalTotal}
          discount={discount}
          couponApplied={couponApplied}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          handleApplyCoupon={handleApplyCoupon}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          removeFromCart={removeFromCart}
          handlePurchase={handlePurchaseAndStockUpdate}
        />
        
        <QRScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={handleScan}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="productos" element={<AdminLayout><ProductManager /></AdminLayout>} />
                <Route path="ventas" element={<AdminLayout><SalesDashboard /></AdminLayout>} />
              </Routes>
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="container">
              <div>
                <div className="placeholder">
                  <div className="parallax-window" data-parallax="scroll" data-image-src="https://assets.elgourmet.com/wp-content/uploads/2023/03/cover_fpa6sn8vqc_empanadas.jpg">
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
                              <li className="tm-nav-li"><Link to="/" className="tm-nav-link">Home</Link></li>
                              <li className="tm-nav-li"><Link to="/about" className="tm-nav-link">Sobre Nosotros</Link></li>
                              <li className="tm-nav-li"><Link to="/contact" className="tm-nav-link">Contacto</Link></li>
                            </ul>
                            
                            <div className="header-icons-container">
                              <button className="scan-qr-btn" onClick={() => setIsScannerOpen(true)}>
                                <i className="fas fa-qrcode"></i>
                              </button>
                              
                              {/* ============================================== */}
                              {/* ===== AQUÍ ESTÁ EL CAMBIO DE ÍCONO ===== */}
                              {/* ============================================== */}
                              {isCartOpen ? (
                                <div className="cart-close-icon" onClick={() => setIsCartOpen(false)}>
                                  &times;
                                </div>
                              ) : (
                                <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                                  <img src="/cart-icon.png" alt="Carrito" />
                                  {cart.length > 0 && <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>}
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
                  <Route path="/" element={
                    <>
                      <header className="row tm-welcome-section">
                        <h2 className="col-12 text-center tm-section-title">Bienvenido a La Redonda Sabrosa</h2>
                        <p className="col-12 text-center">El lugar donde encontraras las empanadas mas ricas de Villa Carlos Paz.</p>
                      </header>
                      <div className="promo-section">
                        <h2 className="col-12 text-center tm-section-title promo-title">Promociones del Día</h2>
                        <div className="promo-cards-container">
                          <div className="promo-card">
                            <div className="promo-carousel">
                              {empanadasData.slice(0, 5).map((empanada, index) => ( <img key={empanada.id} src={empanada.image} alt={empanada.name} style={{ animationDelay: `${index * 4}s` }}/> ))}
                            </div>
                            <h3>Media Docena</h3>
                            <p className="promo-old-price"><s>$12.000</s></p>
                            <p className="promo-new-price">$9.000</p>
                            <button className="btn-agregar" onClick={() => handleOpenPromoModal({name: 'Promo Media Docena', price: 9000, quantity: 6})}>
                              Añadir al Carrito
                            </button>
                          </div>
                          <div className="promo-card">
                            <div className="promo-carousel">
                              {empanadasData.slice(5, 10).map((empanada, index) => ( <img key={empanada.id} src={empanada.image} alt={empanada.name} style={{ animationDelay: `${index * 4}s` }}/> ))}
                            </div>
                            <h3>Docena Completa</h3>
                            <p className="promo-old-price"><s>$24.000</s></p>
                            <p className="promo-new-price">$18.000</p>
                            <button className="btn-agregar" onClick={() => handleOpenPromoModal({name: 'Promo Docena Completa', price: 18000, quantity: 12})}>
                              Añadir al Carrito
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="tm-paging-links">
                        <nav>
                          <ul>
                            <li className="tm-paging-item"><a href="#" className={`tm-paging-link ${activePage === 'empanadas' ? 'active' : ''}`} onClick={(e) => {e.preventDefault(); handlePagingClick('empanadas');}}>Empanadas</a></li>
                            <li className="tm-paging-item"><a href="#" className={`tm-paging-link ${activePage === 'salsas' ? 'active' : ''}`} onClick={(e) => {e.preventDefault(); handlePagingClick('salsas');}}>Salsas</a></li>
                          </ul>
                        </nav>
                      </div>
                      {isLoading ? (
                        <p className="text-center" style={{padding: '40px'}}>Cargando productos...</p>
                      ) : (
                        <div className="row tm-gallery">
                          <div id="tm-gallery-page-empanadas" className={`tm-gallery-page ${activePage === 'empanadas' ? '' : 'hidden'}`}>
                            {empanadasData.map((empanada) => (
                              <GalleryItem key={empanada.id} item={empanada} addToCart={addToCart}/>
                            ))}
                          </div>
                          <div id="tm-gallery-page-salsas" className={`tm-gallery-page ${activePage === 'salsas' ? '' : 'hidden'}`}>
                            {salsasData.map((salsa) => (
                              <GalleryItem key={salsa.id} item={salsa} addToCart={addToCart}/>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <footer className="tm-footer text-center">
                <div className="tm-social">
                  <a href="https://instagram.com/la.redonda_sabrosa" target="_blank" className="tm-social-link" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                  <a href="https://wa.me/5493541230992" target="_blank" className="tm-social-link" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
                  <a href="mailto:laredondasabrosa@gmail.com" className="tm-social-link"><i className="fas fa-envelope"></i></a>
                </div>
                <div className="admin-login-link"><Link to="/login">Admin</Link></div>
                <p>Copyright &copy; 2024 La Redonda Sabrosa | Design:{' '}<a rel="nofollow" href="https://templatemo.com">TemplateMo</a></p>
              </footer>
            </div>
          } />
        </Routes>
        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <span className="close-modal-btn" onClick={closePaymentModal}>&times;</span>
              <h4 className="text-center">Detalles del Pago</h4>
              <p>Monto Total: <strong>${finalTotal.toLocaleString('es-AR')}</strong></p>
              <hr />
              <div className="payment-details">
                <p>Por favor, realiza la transferencia a los siguientes datos:</p>
                <div className="alias-info-box">
                  <p className="alias-label">Alias:</p>
                  <div className="alias-group">
                    <strong className="alias-text">laredonda.sabrosa</strong>
                    <button className="copy-alias-btn" onClick={handleCopyAlias}>Copiar Alias</button>
                  </div>
                  {showCopySuccess && <span className="copy-success-message">¡Copiado!</span>}
                </div>
              </div>
              <p className="text-center">Una vez realizado el pago, envíanos el comprobante por{' '}<a href={`https://wa.me/5493541230992?text=${encodeURIComponent(`Hola, realicé una compra en La Redonda Sabrosa.\nMonto: $${finalTotal.toLocaleString('es-AR')}\nProductos:\n${cart.map((item) => `- ${item.name} x${item.quantity} ($${item.price.toLocaleString('es-AR')})`).join('\n')}\nAlias de pago: laredonda.sabrosa`)}`} target="_blank" rel="noopener noreferrer" className="whatsapp-green" style={{ fontWeight: 'bold', textDecoration: 'none' }} onClick={handlePaymentConfirmation}>WhatsApp</a>.</p>
              <div className="cart-buttons"><button className="btn-cerrar btn-cerrar:hover" onClick={closePaymentModal}>Cerrar</button></div>
            </div>
          </div>
        )}
      </>
    </Router>
  );
}

export default App;