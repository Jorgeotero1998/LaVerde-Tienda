import React, { useContext, useState } from "react";
import { Context } from "../layout";
import PageHeader from "../components/PageHeader";
import { fallbackProductImage, getProductImage } from "../utils/productImages";

const EMPTY_FORM = {
  name: "",
  price: "",
  stock: "",
  category: "",
  unit: "pza",
  description: "",
  image_url: "",
};

export const Admin = () => {
  const { store, actions } = useContext(Context);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const products = store.products || [];
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const categories = new Set(products.map((p) => p.category).filter(Boolean)).size;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.price?.trim()) {
      setFormError("Nombre y precio son obligatorios.");
      return;
    }
    setFormError("");
    setSaving(true);
    await actions.createProduct(form);
    setSaving(false);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Eliminar "${name}" del catálogo?`)) await actions.deleteProduct(id);
  };

  return (
    <div className="page admin-page">
      <div className="container">
        <PageHeader
          title="Panel de administración"
          subtitle="Gestión de catálogo · CRUD de productos en vivo"
        />

        <div className="ui-stat-grid">
          <div className="ui-stat">
            <div className="ui-stat__icon">📦</div>
            <div className="ui-stat__value">{products.length}</div>
            <div className="ui-stat__label">Productos activos</div>
          </div>
          <div className="ui-stat">
            <div className="ui-stat__icon">🏷️</div>
            <div className="ui-stat__value">{categories}</div>
            <div className="ui-stat__label">Categorías</div>
          </div>
          <div className="ui-stat">
            <div className="ui-stat__icon">📊</div>
            <div className="ui-stat__value">{totalStock}</div>
            <div className="ui-stat__label">Unidades en stock</div>
          </div>
        </div>

        <form className="ui-panel p-4 mb-4 admin-form" onSubmit={handleCreate}>
          <h2 className="h5 text-accent mb-3">
            <i className="fas fa-plus-circle me-2"></i> Nuevo producto
          </h2>
          {formError && (
            <div className="ui-alert ui-alert--error mb-3">
              <i className="fas fa-exclamation-circle"></i> {formError}
            </div>
          )}
          <div className="row g-3">
            {[
              ["name", "Nombre", "text", true],
              ["price", "Precio", "number", true],
              ["stock", "Stock", "number", false],
              ["category", "Categoría", "text", false],
              ["unit", "Unidad", "text", false],
              ["image_url", "URL imagen", "url", false],
            ].map(([field, label, type, required]) => (
              <div className="col-md-4" key={field}>
                <label className="ui-label" htmlFor={"admin-" + field}>
                  {label}
                </label>
                <input
                  id={"admin-" + field}
                  className="form-control-dark"
                  name={field}
                  type={type}
                  required={required}
                  value={form[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="col-12">
              <label className="ui-label" htmlFor="admin-description">
                Descripción
              </label>
              <textarea
                id="admin-description"
                className="form-control-dark"
                name="description"
                rows={2}
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-accent" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-verde me-2"></span> Guardando…
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i> Publicar producto
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="ui-panel p-4">
          <h2 className="h5 text-accent mb-3">
            <i className="fas fa-list me-2"></i> Inventario ({products.length})
          </h2>
          <div className="table-responsive">
            <table className="table table-verde align-middle">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={getProductImage(p)}
                        alt=""
                        className="admin-table-thumb"
                        onError={(e) => {
                          e.currentTarget.src = fallbackProductImage(p);
                        }}
                      />
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                      <div className="small text-muted-theme">{p.description}</div>
                    </td>
                    <td>
                      <span className="category-chip">{p.category}</span>
                    </td>
                    <td className="fw-bold text-accent">${p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm admin-btn-delete"
                        onClick={() => handleDelete(p.id, p.name)}
                        aria-label={"Eliminar " + p.name}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
