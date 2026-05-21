import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/#productos", label: "Productos" },
  { to: "/cart", label: "Mi Canasta" },
  { to: "/login", label: "Acceso Clientes" },
];

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="site-footer__brand">
            <span className="site-footer__logo-icon" aria-hidden="true">🥦</span>
            La Verde
          </div>
          <p className="site-footer__tagline">
            Del campo a tu puerta. Frutas y verduras frescas, orgánicas y de temporada con entrega en el día.
          </p>
        </div>
        <div className="col-md-4">
          <h6 className="site-footer__heading">Enlaces útiles</h6>
          <ul className="list-unstyled d-flex flex-column gap-2 m-0">
            {FOOTER_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="site-footer__link">{label}</Link>
              </li>
            ))}
            <li>
              <Link to="/signup" className="site-footer__link">Crear cuenta</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6 className="site-footer__heading">Contacto</h6>
          <div className="d-flex flex-column gap-2 site-footer__contact">
            <span className="d-flex align-items-center gap-2">
              <i className="fas fa-map-marker-alt site-footer__contact-icon"></i>
              Buenos Aires, Argentina
            </span>
            <span className="d-flex align-items-center gap-2">
              <i className="fas fa-phone site-footer__contact-icon"></i>
              +54 11 1234-5678
            </span>
            <span className="d-flex align-items-center gap-2">
              <i className="fas fa-envelope site-footer__contact-icon"></i>
              hola@laverde.com.ar
            </span>
            <span className="d-flex align-items-center gap-2">
              <i className="fas fa-clock site-footer__contact-icon"></i>
              Lun–Sáb 8hs a 18hs
            </span>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        © {new Date().getFullYear()} La Verde — Hecho con 💚 en Argentina
      </div>
    </div>
  </footer>
);

export default Footer;
