import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";import { Context } from "../layout";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = store.cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const favCount = store.favorites.length;
  const handleLogout = () => { actions.logout(); navigate("/"); };

  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener("open-cart-drawer", openCart);
    return () => window.removeEventListener("open-cart-drawer", openCart);
  }, []);

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle("is-scrolled", window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = e.target.elements.search?.value?.trim() || "";
    const params = q ? "?q=" + encodeURIComponent(q) : "";
    if (location.pathname !== "/") navigate("/" + params);
    else navigate({ pathname: "/", search: params });
    setTimeout(() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const navClass = ({ isActive }) => "nav-link nav-link-custom" + (isActive ? " is-active" : "");

  return (
    <>
      <nav className={"navbar navbar-expand-lg navbar-verde sticky-top " + (cartOpen ? "navbar-verde--dimmed" : "")}>
        <div className="container-fluid px-3 px-lg-4">
          <Link className="navbar-verde__brand-wrap" to="/">
            <span className="navbar-verde__logo-icon" aria-hidden="true">🥦</span>
            <span className="navbar-brand">La Verde</span>
          </Link>

          <form className="navbar-verde__search-wrap" onSubmit={handleSearchSubmit} role="search">
            <div className="search-field">
              <span className="search-field__icon">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="search"
                name="search"
                className="form-control-dark"
                placeholder="Buscar productos..."
                defaultValue={new URLSearchParams(location.search).get("q") || ""}
                aria-label="Buscar productos"
              />
            </div>
          </form>

          <button
            className="navbar-toggler navbar-verde__toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-label="Abrir menú"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <div className="navbar-verde__nav-links ms-lg-auto me-lg-3">
              <NavLink to="/" className={navClass} end>Inicio</NavLink>
              <a
                href="/#productos"
                className="nav-link nav-link-custom"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname !== "/") navigate("/#productos");
                  else document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Productos
              </a>
              {store.token && (
                <>
                  <NavLink to="/favorites" className={navClass}>Favoritos</NavLink>
                  <NavLink to="/orders" className={navClass}>Mis pedidos</NavLink>
                  <NavLink to="/profile" className={navClass}>Mi cuenta</NavLink>
                  {store.user?.isAdmin && (
                    <NavLink to="/admin" className={navClass}>Admin</NavLink>
                  )}
                </>
              )}
            </div>

            <div className="d-flex align-items-center navbar-verde__actions">
              {store.token && (
                <Link
                  to="/favorites"
                  className="navbar-verde__fav-trigger"
                  aria-label={"Favoritos" + (favCount ? ` (${favCount})` : "")}
                  title="Mis favoritos"
                >
                  <i className="fas fa-heart"></i>
                  {favCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill navbar-verde__fav-badge cart-badge-pop">
                      {favCount}
                    </span>
                  )}
                </Link>
              )}

              <button
                type="button"
                className="navbar-verde__cart-trigger"
                onClick={() => setCartOpen(true)}
                aria-label="Abrir carrito"
                aria-expanded={cartOpen}
              >
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <span key={cartCount} className="position-absolute top-0 start-100 translate-middle badge rounded-pill navbar-verde__cart-badge cart-badge-pop">
                    {cartCount}
                  </span>
                )}
              </button>

              {store.token ? (
                <>
                  <span className="navbar-verde__greeting">
                    Hola, <span className="navbar-verde__greeting-name">{store.user?.firstName}</span>
                  </span>
                  <button type="button" className="btn btn-outline-accent btn-sm" onClick={handleLogout}>
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-accent btn-sm">Ingresar</Link>
                  <Link to="/signup" className="btn btn-accent btn-sm">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
