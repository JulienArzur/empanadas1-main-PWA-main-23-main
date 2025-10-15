// src/QRScanner.jsx

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './index.css'; // Asegúrate de que el CSS esté linkeado

const QRScanner = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef(null); // Para guardar la instancia del scanner
  const qrboxSize = useRef(250); // Tamaño inicial del recuadro del QR

  useEffect(() => {
    if (!isOpen) { // Si el modal no está abierto, no hacemos nada o limpiamos
      if (scannerRef.current && scannerRef.current.getState() === 2) { // 2 = SCANNING
        scannerRef.current.stop().then(() => {
          scannerRef.current = null;
        }).catch(err => {
          console.error("Error al detener el scanner al cerrar.", err);
          scannerRef.current = null;
        });
      }
      return;
    }

    // El modal está abierto, iniciamos el scanner
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('qr-reader-container');
    }

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const backCamera = cameras.find(camera => 
            camera.label.toLowerCase().includes('back') || camera.facingMode === 'environment'
          );
          const cameraId = backCamera ? backCamera.id : cameras[0].id; // Usar trasera si existe, sino la primera

          // Determinar el tamaño del qrbox dinámicamente
          // html5-qrcode necesita el tamaño inicial, luego el CSS lo ajustará
          const container = document.getElementById('qr-reader-container');
          if (container) {
            const minEdge = Math.min(container.offsetWidth, container.offsetHeight);
            qrboxSize.current = Math.floor(minEdge * 0.8); // 80% del tamaño del contenedor
          }
          
          await scannerRef.current.start(
            cameraId, 
            { 
              fps: 10, 
              qrbox: { width: qrboxSize.current, height: qrboxSize.current } // Proporciona un tamaño inicial
            },
            (decodedText, decodedResult) => {
              onScan(decodedText);
            },
            (errorMessage) => {
              // Manejo de errores de escaneo (se pueden ignorar o loguear)
            }
          );
        } else {
          alert("No se encontraron cámaras en este dispositivo.");
          onClose();
        }
      } catch (err) {
        console.error("Error al iniciar la cámara: ", err);
        // El error 9 es cuando el usuario no da permisos
        if (err.message && err.message.includes('permission')) {
          // El usuario verá los botones por defecto de html5-qrcode para pedir permisos
        } else {
          alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.");
          onClose(); // Cerramos si hay un error grave no relacionado con permisos
        }
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (scannerRef.current && scannerRef.current.getState() === 2) {
        scannerRef.current.stop().then(() => {
          scannerRef.current = null;
        }).catch(err => {
          console.error("Error al detener el scanner en cleanup.", err);
        });
      }
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-container simple-style" onClick={(e) => e.stopPropagation()}>
        <p>Apunta la cámara al código QR del producto</p>
        <div id="qr-reader-container" className="qr-reader-minimal">
          {/* html5-qrcode renderizará aquí el video y los botones de permisos/archivo */}
        </div>
        <button className="btn-cerrar" style={{marginTop: '20px'}} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default QRScanner;