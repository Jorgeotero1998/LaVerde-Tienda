import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../layout";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { actions.clearMessage(); }, []);
  useEffect(() => { if (store.token) navigate("/"); }, [store.token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (store.error) actions.clearMessage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await actions.login(form.email, form.password);
    setLoading(false);
    if (ok) navigate("/");
  };

  return (
    <AuthLayout
      icon="🥦"
      title="¡Bienvenido de vuelta!"
      subtitle="Ingresá a tu cuenta para continuar comprando"
    >
      {store.error && (
        <div className="ui-alert ui-alert--error">
          <i className="fas fa-exclamation-circle"></i> {store.error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="ui-field">
          <label className="ui-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            className="form-control-dark"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ui-field">
          <label className="ui-label" htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            name="password"
            className="form-control-dark"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="text-end mb-3">
          <Link to="/forgot-password" className="ui-link">¿Olvidaste tu contraseña?</Link>
        </div>

        <button type="submit" className="btn btn-accent btn-accent--block" disabled={loading}>
          {loading ? (
            <><span className="spinner-verde me-2"></span> Ingresando...</>
          ) : (
            <><i className="fas fa-sign-in-alt me-2"></i> Iniciar sesión</>
          )}
        </button>
      </form>

      <p className="auth-page__footer-text">
        ¿No tenés cuenta? <Link to="/signup" className="ui-link">Registrate gratis</Link>
      </p>

      <div className="ui-demo-hint">
        Admin: <strong>admin@laverde.com</strong> / <strong>admin1234</strong>
        <br />
        O registrate en <strong>Registrate</strong> para cuenta de cliente.
      </div>
    </AuthLayout>
  );
};

export default Login;
