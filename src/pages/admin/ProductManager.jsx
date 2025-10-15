// src/pages/admin/ProductManager.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import '../../index.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState = { name: '', description: '', price: '', stock: '', category: 'empanadas', image: '' };
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData(prev => ({ ...prev, image: file.name }));
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setFormData({ ...product, id: product.id });
    setImageFile(null);
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Por favor, completa nombre, precio y stock.");
      return;
    }
    if (!isEditing && !imageFile) {
      alert("Por favor, selecciona una imagen para el nuevo producto.");
      return;
    }

    setIsLoading(true);
    const imageUrl = imageFile ? `/images/${imageFile.name}` : formData.image;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      image: imageUrl,
    };

    try {
      if (isEditing) {
        const productDoc = doc(db, "products", formData.id);
        await updateDoc(productDoc, productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }
      await fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que querés borrar este producto?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        await fetchProducts();
      } catch (error) {
        console.error("Error al borrar el producto:", error);
        alert("Hubo un error al borrar el producto.");
      }
    }
  };

  return (
    <div className="admin-crud-container">
      <div className="admin-form-card">
        <h3>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre del producto" required />
          <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Descripción breve" />
          <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Precio" required />
          <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="Stock disponible" required />
          <select name="category" value={formData.category} onChange={handleInputChange}>
            <option value="empanadas">Empanada</option>
            <option value="salsas">Salsa</option>
          </select>
          <div className="file-input-wrapper">
            <label htmlFor="imageFile" className="file-input-label">
              {(imageFile ? imageFile.name : formData.image.split('/').pop()) || "Seleccionar Imagen..."}
            </label>
            <input id="imageFile" name="imageFile" type="file" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Agregar Producto')}
            </button>
            {isEditing && <button type="button" className="btn-cancelar" onClick={cancelEdit}>Cancelar Edición</button>}
          </div>
        </form>
      </div>
      
      <div className="admin-table-card">
        <h3>Listado de Productos</h3>
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td data-label="Imagen"><img src={product.image} alt={product.name} className="admin-product-img" /></td>
                <td data-label="Nombre">{product.name}</td>
                <td data-label="Descripción">{product.description}</td>
                <td data-label="Precio">${product.price.toLocaleString('es-AR')}</td>
                <td data-label="Stock">{product.stock}</td>
                <td data-label="Acciones">
                  <div className="admin-actions">
                    <button className="btn-editar" onClick={() => handleEdit(product)}>Editar</button>
                    <button className="btn-borrar" onClick={() => handleDelete(product.id)}>Borrar</button>
                  </div>
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