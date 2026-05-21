import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({ title, subtitle, backTo, backLabel }) => (
  <header className="page-header">
    {backTo && (
      <Link to={backTo} className="page-header__back">
        <i className="fas fa-arrow-left"></i> {backLabel || "Volver"}
      </Link>
    )}
    <h1 className="page-header__title">{title}</h1>
    {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
  </header>
);

export default PageHeader;
