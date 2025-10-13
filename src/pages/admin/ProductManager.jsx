// src/pages/admin/ProductManager.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js'; // YA NO NECESITAMOS STORAGE AQUÍ
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import '../../index.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'empanadas', imageFile: null });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const targetProduct = editingProduct ? setEditingProduct : setNewProduct;
    targetProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const targetProduct = editingProduct ? setEditingProduct : setNewProduct;
      // Guardamos solo el nombre del archivo
      targetProduct(prev => ({ ...prev, imageFile: file, imageName: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingProduct) {
        // --- LÓGICA DE ACTUALIZAR ---
        const productRef = doc(db, "products", editingProduct.id);
        const updatedData = {
          name: editingProduct.name,
          price: Number(editingProduct.price),
          stock: Number(editingProduct.stock),
          category: editingProduct.category,
          // Si se seleccionó una nueva imagen, usamos su nombre, si no, mantenemos el anterior
          image: editingProduct.imageName ? `/images/${editingProduct.imageName}` : editingProduct.image,
        };
        await updateDoc(productRef, updatedData);
        setProducts(products.map(p => p.id === editingProduct.id ? { ...updatedData, id: editingProduct.id } : p));
        setEditingProduct(null);

      } else {
        // --- LÓGICA DE CREAR ---
        if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.imageFile) {
          alert("Por favor, completa todos los campos, incluyendo la imagen.");
          setIsLoading(false);
          return;
        }
        
        // Creamos la ruta de la imagen que estará en la carpeta /public/images/
        const imageUrl = `/images/${newProduct.imageFile.name}`;

        const productData = {
          name: newProduct.name,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
          category: newProduct.category,
          image: imageUrl, // Guardamos la ruta local
        };
        
        const docRef = await addDoc(collection(db, "products"), productData);
        setProducts(prevProducts => [...prevProducts, { id: docRef.id, ...productData }]);
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setIsLoading(false);
      setNewProduct({ name: '', price: '', stock: '', category: 'empanadas', imageFile: null, imageName: '' });
      e.target.reset();
    }
  };

  const handleDelete = async (productId) => {
    // ... (la función de borrar no necesita cambios)
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  // El JSX no necesita casi ningún cambio
  return (
    <div className="admin-crud-container">
      <div className="admin-form-card">
        <h3>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit}>
          {/* ...tus inputs de texto... */}
           <input name="name" value={editingProduct ? editingProduct.name : newProduct.name} onChange={handleInputChange} placeholder="Nombre del producto" required />
          <input name="price" type="number" value={editingProduct ? editingProduct.price : newProduct.price} onChange={handleInputChange} placeholder="Precio" required />
          <input name="stock" type="number" value={editingProduct ? editingProduct.stock : newProduct.stock} onChange={handleInputChange} placeholder="Stock disponible" required />
          <select name="category" value={editingProduct ? editingProduct.category : newProduct.category} onChange={handleInputChange}>
            <option value="empanadas">Empanada</option>
            <option value="salsas">Salsa</option>
            <option value="bebidas">Bebida</option>
          </select>
          <div className="file-input-wrapper">
            <label htmlFor="imageFile" className="file-input-label">
              {newProduct.imageName || editingProduct?.imageName || "Seleccionar Imagen..."}
            </label>
            <input id="imageFile" name="imageFile" type="file" onChange={handleFileChange} required={!editingProduct} />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : (editingProduct ? 'Guardar Cambios' : 'Agregar Producto')}
          </button>
          {editingProduct && <button type="button" onClick={() => setEditingProduct(null)}>Cancelar Edición</button>}
        </form>
      </div>
      <div className="admin-table-card">
        <h3>Listado de Productos</h3>
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.image} alt={product.name} width="50" /></td>
                <td>{product.name}</td>
                <td>${product.price.toLocaleString('es-AR')}</td>
                <td>{product.stock}</td>
                <td>
                  <button onClick={() => setEditingProduct({ ...product, imageName: product.image.split('/').pop() })}>Editar</button>
                  <button onClick={() => handleDelete(product.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManager;