import React from "react";

const AuthLayout = ({ icon, title, subtitle, children, wide }) => (
  <div className="auth-page">
    <div className="auth-page__orb auth-page__orb--1" aria-hidden="true" />
    <div className="auth-page__orb auth-page__orb--2" aria-hidden="true" />
    <div className={"auth-page__inner " + (wide ? "auth-page__inner--wide" : "")}>
      <header className="auth-page__header">
        <span className="auth-page__icon" aria-hidden="true">{icon}</span>
        <h1 className="auth-page__title">{title}</h1>
        {subtitle && <p className="auth-page__subtitle">{subtitle}</p>}
      </header>
      <div className="ui-panel ui-panel--auth">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
