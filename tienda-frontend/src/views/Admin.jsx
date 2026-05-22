import React, { useContext, useState } from "react";
import { Context } from "../layout";

export const Admin = () => {
  const { store, actions } = useContext(Context);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", unit: "pza", description: "", image_url: "" });

  const products = store.products || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!form.name || !form.price) return alert("Nombre y precio son obligatorios");
    await actions.createProduct(form);
    setForm({ name: "", price: "", stock: "", category: "", unit: "pza", description: "", image_url: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar producto?")) await actions.deleteProduct(id);
  };

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="page-header__title">Panel Admin</h1>
      </div>

      <div className="ui-panel p-4 mb-4">
        <h5 className="text-accent mb-3">Nuevo producto</h5>
        <div className="row g-2">
          {[["name","Nombre"],["price","Precio"],["stock","Stock"],["category","Categoría"],["unit","Unidad"],["image_url","URL imagen"]].map(([field, label]) => (
            <div className="col-md-4" key={field}>
              <label className="ui-label">{label}</label>
              <input className="form-control" name={field} value={form[field]} onChange={handleChange} />
            </div>
          ))}
          <div className="col-12">
            <label className="ui-label">Descripción</label>
            <input className="form-control" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="col-12 mt-2">
            <button className="btn btn-success" onClick={handleCreate}>Crear producto</button>
          </div>
        </div>
      </div>

      <div className="ui-panel p-4">
        <h5 className="text-accent mb-3">Productos ({products.length})</h5>
        <div className="table-responsive">
          <table className="table table-verde">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="btn btn-sm admin-btn-delete text-white" onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
