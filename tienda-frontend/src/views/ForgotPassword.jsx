import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../layout";
import AuthLayout from "../components/AuthLayout";
import { forgotPasswordCopy as copy } from "../copy/authStrings";

const ForgotPassword = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    actions.clearMessage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const ok = await actions.forgotPassword(email);
    setIsSending(false);
    if (ok) setSubmitted(true);
  };

  return (
    <AuthLayout
      icon={<i className="fas fa-lock" aria-hidden="true" />}
      title={copy.title}
      subtitle={copy.subtitle}
    >
      {store.error && (
        <div className="ui-alert ui-alert--error">
          <i className="fas fa-exclamation-circle"></i> {store.error}
        </div>
      )}

      {submitted ? (
        <div className="empty-state py-4">
          <span className="auth-page__icon auth-page__icon--success" aria-hidden="true">
            <i className="fas fa-envelope-open-text"></i>
          </span>
          <h2 className="auth-page__title">{copy.successTitle}</h2>
          <p className="text-muted-theme">
            {copy.successBodyBefore}
            <strong className="text-accent">{email}</strong>
            {copy.successBodyAfter}
          </p>
          <Link to="/login" className="btn btn-accent btn-accent--block mt-3">
            {copy.backToLogin}
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="ui-field">
              <label className="ui-label" htmlFor="forgot-email">
                {copy.emailLabel}
              </label>
              <input
                id="forgot-email"
                type="email"
                className="form-control-dark"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (store.error) actions.clearMessage();
                }}
                required
                autoComplete="email"
              />
            </div>

            <button type="submit" className="btn btn-accent btn-accent--block" disabled={isSending}>
              {isSending ? (
                <>
                  <span className="spinner-verde me-2" role="status" aria-hidden="true"></span>
                  {copy.sending}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  {copy.submit}
                </>
              )}
            </button>
          </form>

          <p className="auth-page__footer-text">
            <Link to="/login" className="ui-link">
              <i className="fas fa-arrow-left me-1"></i> {copy.backToLogin}
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
