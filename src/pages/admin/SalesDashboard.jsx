// src/pages/admin/SalesDashboard.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import '../../index.css';

const SalesDashboard = () => {
  const [todayStats, setTodayStats] = useState({ revenue: 0, orders: 0, items: 0 });
  const [totalStats, setTotalStats] = useState({ revenue: 0, orders: 0, items: 0 });
  
  // Nuevos estados para las tablas de productos
  const [todayProducts, setTodayProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const salesRef = collection(db, "sales");
        const q = query(salesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const allSales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();

        const todaySales = allSales.filter(sale => {
          const saleTime = sale.createdAt.toDate().getTime();
          return saleTime >= startOfToday && saleTime < endOfToday;
        });

        const calculateStats = (salesArray) => {
          const revenue = salesArray.reduce((sum, sale) => sum + sale.total, 0);
          const items = salesArray.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
          return { revenue, orders: salesArray.length, items };
        };
        
        // Función para resumir productos vendidos
        const summarizeProducts = (salesArray) => {
          const productSummary = {};
          salesArray.forEach(sale => {
            sale.items.forEach(item => {
              if (productSummary[item.name]) {
                productSummary[item.name] += item.quantity;
              } else {
                productSummary[item.name] = item.quantity;
              }
            });
          });
          // Convertir el objeto a un array y ordenarlo por cantidad
          return Object.entries(productSummary)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity);
        };

        setTodayStats(calculateStats(todaySales));
        setTotalStats(calculateStats(allSales));
        setTodayProducts(summarizeProducts(todaySales));
        setTotalProducts(summarizeProducts(allSales));

      } catch (error) {
        console.error("Error al cargar las ventas: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (isLoading) {
    return <p>Calculando ventas...</p>;
  }

  return (
    <div className="dashboard-container">
      {/* --- SECCIÓN DE ESTADÍSTICAS (Sin cambios) --- */}
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Resumen de Hoy</h3>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-card-icon revenue"><i className="fas fa-dollar-sign"></i></div><div className="stat-card-info"><h4>Ingresos de Hoy</h4><p>${todayStats.revenue.toLocaleString('es-AR')}</p></div></div>
          <div className="stat-card"><div className="stat-card-icon orders"><i className="fas fa-receipt"></i></div><div className="stat-card-info"><h4>Pedidos de Hoy</h4><p>{todayStats.orders}</p></div></div>
          <div className="stat-card"><div className="stat-card-icon items"><i className="fas fa-shopping-basket"></i></div><div className="stat-card-info"><h4>Productos Vendidos Hoy</h4><p>{todayStats.items}</p></div></div>
        </div>
      </div>
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Totales Históricos</h3>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-card-icon revenue"><i className="fas fa-landmark"></i></div><div className="stat-card-info"><h4>Ingresos Totales</h4><p>${totalStats.revenue.toLocaleString('es-AR')}</p></div></div>
          <div className="stat-card"><div className="stat-card-icon orders"><i className="fas fa-file-invoice-dollar"></i></div><div className="stat-card-info"><h4>Pedidos Totales</h4><p>{totalStats.orders}</p></div></div>
          <div className="stat-card"><div className="stat-card-icon items"><i className="fas fa-boxes"></i></div><div className="stat-card-info"><h4>Productos Totales Vendidos</h4><p>{totalStats.items}</p></div></div>
        </div>
      </div>

      {/* ===== NUEVAS TABLAS DE PRODUCTOS VENDIDOS ===== */}
      <div className="product-summary-grid">
        {/* --- Tabla de Productos Vendidos Hoy --- */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Productos Vendidos Hoy</h3>
          <div className="sales-history-table admin-table-card">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                </tr>
              </thead>
              <tbody>
                {todayProducts.length > 0 ? (
                  todayProducts.map(product => (
                    <tr key={product.name}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" style={{ textAlign: 'center' }}>No se vendieron productos hoy.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Tabla de Productos Vendidos en Total --- */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Productos Vendidos en Total (Histórico)</h3>
          <div className="sales-history-table admin-table-card">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                </tr>
              </thead>
              <tbody>
                {totalProducts.length > 0 ? (
                  totalProducts.map(product => (
                    <tr key={product.name}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" style={{ textAlign: 'center' }}>Todavía no hay ventas registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;