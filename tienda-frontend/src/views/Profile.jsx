import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../layout";
import PageHeader from "../components/PageHeader";

const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!store.token) { navigate("/login"); return; }
    if (store.user) setForm({ firstName: store.user.firstName || "", lastName: store.user.lastName || "", email: store.user.email || "" });
    actions.clearMessage();
  }, [store.token, store.user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cartCount = store.cart.reduce((acc, i) => acc + i.quantity, 0);
  const favCount = store.favorites.length;
  const cartTotal = store.cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="page page--narrow">
      <div className="container">
        <PageHeader title="👤 Mi perfil" subtitle="Gestioná tu información personal" />

        <div className="ui-stat-grid">
          <div className="ui-stat">
            <div className="ui-stat__icon">🛒</div>
            <div className="ui-stat__value">{cartCount}</div>
            <div className="ui-stat__label">En carrito</div>
          </div>
          <Link to="/favorites" className="ui-stat ui-stat--link text-decoration-none">
            <div className="ui-stat__icon">❤️</div>
            <div className="ui-stat__value">{favCount}</div>
            <div className="ui-stat__label">Favoritos</div>
          </Link>
          <div className="ui-stat">
            <div className="ui-stat__icon">💚</div>
            <div className="ui-stat__value">${cartTotal.toFixed(0)}</div>
            <div className="ui-stat__label">Total carrito</div>
          </div>
        </div>

        <div className="ui-panel">
          <h2 className="h5 fw-bold mb-4">Datos personales</h2>

          {saved && (
            <div className="ui-alert ui-alert--success">
              <i className="fas fa-check-circle"></i> Perfil actualizado con éxito
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 ui-field">
                <label className="ui-label" htmlFor="profile-first">Nombre</label>
                <input id="profile-first" type="text" name="firstName" className="form-control-dark" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="col-md-6 ui-field">
                <label className="ui-label" htmlFor="profile-last">Apellido</label>
                <input id="profile-last" type="text" name="lastName" className="form-control-dark" value={form.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="ui-field">
              <label className="ui-label" htmlFor="profile-email">Email</label>
              <input id="profile-email" type="email" name="email" className="form-control-dark" value={form.email} onChange={handleChange} required />
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <button type="submit" className="btn btn-accent">
                <i className="fas fa-save me-2"></i> Guardar cambios
              </button>
              <button type="button" className="btn btn-outline-accent" onClick={() => { actions.logout(); navigate("/"); }}>
                <i className="fas fa-sign-out-alt me-2"></i> Cerrar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
