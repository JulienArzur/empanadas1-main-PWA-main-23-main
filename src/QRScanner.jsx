// src/QRScanner.jsx
import React, { useEffect } from 'react';
// CORRECCIÓN: Estaba mal escrito "Html5QqrcodeScanner", ahora es "Html5QrcodeScanner"
import { Html5QrcodeScanner } from 'html5-qrcode'; 
import './index.css';

const QRScanner = ({ isOpen, onClose, onScan }) => {

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Se crea una sola instancia del escáner
    const scanner = new Html5QrcodeScanner(
      'qr-reader-container', 
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 }
      },
      false
    );

    const onScanSuccess = (decodedText, decodedResult) => {
      // Nos aseguramos de que el escáner se limpie una sola vez
      if (scanner.getState() === 2) { // 2 es el estado de "escaneando"
        scanner.clear();
        onScan(decodedText);
      }
    };
    
    const onScanFailure = (error) => {
      // Ignoramos los errores de "QR no encontrado" que aparecen constantemente
    };
    
    // Empezamos a escanear
    scanner.render(onScanSuccess, onScanFailure);

    // Función de "limpieza": se ejecuta cuando el componente se cierra
    return () => {
      // Nos aseguramos de que la cámara se apague siempre
      if (scanner && scanner.getState() === 2) {
        scanner.clear().catch(error => {
          console.error("Fallo al limpiar el escáner al cerrar.", error);
        });
      }
    };
  }, [isOpen, onScan]); // Las dependencias del efecto

  if (!isOpen) {
    return null;
  }

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-container" onClick={(e) => e.stopPropagation()}>
        <p>Apunta la cámara al código QR del producto</p>
        {/* La librería usará este div para mostrar la cámara */}
        <div id="qr-reader-container"></div>
        <button className="btn-cerrar" style={{marginTop: '15px'}} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default QRScanner;