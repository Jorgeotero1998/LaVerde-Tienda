import React, { useState, useEffect, useContext } from "react";
import { apiFetch, apiUploadImage } from "../api/client";
import { Context } from "../layout";
import { adminCopy as t } from "../copy/adminStrings";
import { fallbackProductImage, getProductImage } from "../utils/productImages";

const EMPTY = {
  id: null,
  name: "",
  description: "",
  price: "",
  stock: "",
  unit: "pza",
  category: "Verduras",
  image_url: "",
};

const CATEGORIES = [
  "Verduras",
  "Frutas",
  "Cítricos",
  "Hierbas",
  "Condimentos",
  "Pecuarios",
];

export const Admin = () => {
  const { actions } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiFetch("/products", { token: null });
      setProducts(data);
      actions.getProducts();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const data = await apiUploadImage(file);
      setCurrentProduct((p) => ({ ...p, image_url: data.image_url }));
      setStatusMsg(t.uploadOk);
    } catch (err) {
      setErrorMsg(err.message || t.uploadFail);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const body = {
      name: currentProduct.name,
      description: currentProduct.description,
      price: parseFloat(currentProduct.price),
      stock: parseInt(currentProduct.stock, 10),
      unit: currentProduct.unit,
      category: currentProduct.category,
      image_url: currentProduct.image_url,
    };

    try {
      if (isEditing) {
        await apiFetch(`/products/${currentProduct.id}`, { method: "PUT", body });
      } else {
        await apiFetch("/products", { method: "POST", body });
      }
      resetForm();
      loadProducts();
      setStatusMsg(isEditing ? "Producto actualizado." : "Producto creado.");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct({
      ...product,
      price: String(product.price),
      stock: String(product.stock),
    });
    setStatusMsg("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto del catálogo?")) return;
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      loadProducts();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(EMPTY);
    setErrorMsg("");
  };

  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-header__title">{t.title}</h1>
          <p className="page-header__subtitle">{t.subtitle}</p>
        </header>

        {errorMsg && (
          <div className="ui-alert ui-alert--error mb-3">
            <i className="fas fa-exclamation-circle"></i> {errorMsg}
          </div>
        )}
        {statusMsg && (
          <div className="ui-alert ui-alert--success mb-3">
            <i className="fas fa-check-circle"></i> {statusMsg}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="ui-panel p-4">
              <h3 className="mb-4 fw-bold">
                {isEditing ? t.editProduct : t.newProduct}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="ui-label">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control-dark"
                    value={currentProduct.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="ui-label">{t.category}</label>
                  <select
                    name="category"
                    className="form-control-dark"
                    value={currentProduct.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="ui-label">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      className="form-control-dark"
                      value={currentProduct.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="ui-label">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control-dark"
                      value={currentProduct.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="ui-label">Unidad</label>
                  <input
                    type="text"
                    name="unit"
                    className="form-control-dark"
                    placeholder="kg, pza, atado..."
                    value={currentProduct.unit}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="ui-label">{t.imageUpload}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control-dark"
                    onChange={handleImageFile}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="small text-muted-theme mt-1">
                      <span className="spinner-verde me-1"></span>
                      {t.uploading}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="ui-label">{t.imageUrl}</label>
                  <input
                    type="url"
                    name="image_url"
                    className="form-control-dark"
                    placeholder="https://..."
                    value={currentProduct.image_url}
                    onChange={handleChange}
                  />
                </div>

                {currentProduct.image_url && (
                  <div className="mb-3 admin-image-preview">
                    <label className="ui-label">{t.imagePreview}</label>
                    <img src={currentProduct.image_url} alt="Vista previa" />
                  </div>
                )}

                <div className="mb-3">
                  <label className="ui-label">{t.description}</label>
                  <textarea
                    name="description"
                    className="form-control-dark"
                    rows="3"
                    value={currentProduct.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-accent"
                      onClick={resetForm}
                    >
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="btn btn-accent">
                    {isEditing ? t.saveChanges : t.addProduct}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="ui-panel p-4">
              <h3 className="mb-4 fw-bold">{t.inventory}</h3>
              <div className="table-responsive">
                <table className="table-verde">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Producto</th>
                      <th>{t.category}</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={getProductImage(product)}
                            alt=""
                            className="admin-table-thumb"
                            onError={(e) => { e.currentTarget.src = fallbackProductImage(product); }}
                          />
                        </td>
                        <td className="fw-bold">{product.name}</td>
                        <td>
                          <span className="category-chip">{product.category}</span>
                        </td>
                        <td>
                          ${product.price} / {product.unit}
                        </td>
                        <td>{product.stock}</td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-outline-accent btn-sm"
                              onClick={() => handleEdit(product)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-accent btn-sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          {t.noProducts}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
