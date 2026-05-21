import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../layout";
import AuthLayout from "../components/AuthLayout";

const Signup = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => { actions.clearMessage(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldError("");
    if (store.error) actions.clearMessage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setFieldError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 4) {
      setFieldError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    setLoading(true);
    const ok = await actions.signup(form.firstName, form.lastName, form.email, form.password);
    setLoading(false);
    if (ok) navigate("/login");
  };

  return (
    <AuthLayout
      icon="🌱"
      title="Crear cuenta gratis"
      subtitle="Sumate a La Verde y empezá a comprar fresco"
      wide
    >
      {(store.error || fieldError) && (
        <div className="ui-alert ui-alert--error">
          <i className="fas fa-exclamation-circle"></i> {fieldError || store.error}
        </div>
      )}

      {store.message && (
        <div className="ui-alert ui-alert--success">
          <i className="fas fa-check-circle"></i> {store.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-0">
          <div className="col-6 ui-field">
            <label className="ui-label" htmlFor="signup-first">Nombre</label>
            <input id="signup-first" type="text" name="firstName" className="form-control-dark" placeholder="Juan" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="col-6 ui-field">
            <label className="ui-label" htmlFor="signup-last">Apellido</label>
            <input id="signup-last" type="text" name="lastName" className="form-control-dark" placeholder="García" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="ui-field">
          <label className="ui-label" htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" name="email" className="form-control-dark" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
        </div>

        <div className="ui-field">
          <label className="ui-label" htmlFor="signup-pass">Contraseña</label>
          <input id="signup-pass" type="password" name="password" className="form-control-dark" placeholder="Mínimo 4 caracteres" value={form.password} onChange={handleChange} required />
        </div>

        <div className="ui-field">
          <label className="ui-label" htmlFor="signup-confirm">Confirmar contraseña</label>
          <input id="signup-confirm" type="password" name="confirm" className="form-control-dark" placeholder="Repetí tu contraseña" value={form.confirm} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-accent btn-accent--block" disabled={loading}>
          {loading ? (
            <><span className="spinner-verde me-2"></span> Creando cuenta...</>
          ) : (
            <><i className="fas fa-user-plus me-2"></i> Crear cuenta</>
          )}
        </button>
      </form>

      <p className="auth-page__footer-text">
        ¿Ya tenés cuenta? <Link to="/login" className="ui-link">Iniciá sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
