import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../layout";
import { fallbackProductImage, getProductImage } from "../utils/productImages";

const CartDrawer = ({ isOpen, onClose }) => {
  const { store, actions } = useContext(Context);
  const cartTotal = store.cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  useEffect(() => {
    document.body.classList.toggle("cart-drawer-open", isOpen);
    return () => document.body.classList.remove("cart-drawer-open");
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={"cart-drawer-backdrop " + (isOpen ? "is-open" : "")}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={"cart-drawer " + (isOpen ? "is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
      >
        <header className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            <i className="fas fa-shopping-bag"></i> Tu carrito
          </h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            <i className="fas fa-times"></i>
          </button>
        </header>

        <div className="cart-drawer__body">
          {store.cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <span className="cart-drawer__empty-icon" aria-hidden="true">🧺</span>
              <p>Tu canasta está vacía</p>
              <button type="button" className="btn btn-outline-accent" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="cart-drawer__list">
              {store.cart.map((item, index) => (
                <article
                  key={item.id}
                  className="cart-drawer__item"
                  style={{ animationDelay: 0.06 + index * 0.07 + "s" }}
                >
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="cart-drawer__item-img"
                    onError={(e) => { e.currentTarget.src = fallbackProductImage(item); }}
                  />
                  <div className="cart-drawer__item-info">
                    <h3 className="cart-drawer__item-name">{item.name}</h3>
                    <p className="cart-drawer__item-meta">{item.category || "Producto"}</p>
                    <p className="cart-drawer__item-price">${(item.price * (item.quantity || 1)).toFixed(0)}</p>
                    <div className="qty-control">
                      <button type="button" className="qty-control__btn" onClick={() => actions.updateCartQuantity(item.id, item.quantity - 1)} aria-label="Reducir cantidad">−</button>
                      <span className="qty-control__value">{item.quantity}</span>
                      <button type="button" className="qty-control__btn" onClick={() => actions.updateCartQuantity(item.id, item.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-drawer__remove"
                    onClick={() => actions.removeFromCart(item.id)}
                    aria-label={"Eliminar " + item.name}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {store.cart.length > 0 && (
          <footer className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(0)}</strong>
            </div>
            <Link to="/cart" className="btn btn-accent btn-accent--block cart-drawer__checkout" onClick={onClose}>
              Proceder al pago <i className="fas fa-arrow-right"></i>
            </Link>
            <p className="cart-drawer__note">Impuestos y envío se calculan en el checkout</p>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
