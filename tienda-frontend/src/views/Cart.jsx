import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../layout";
import PageHeader from "../components/PageHeader";
import { fallbackProductImage, getProductImage } from "../utils/productImages";

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 350;

const Cart = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = store.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleOrder = async () => {
    setIsProcessing(true);
    const success = await actions.checkoutOrder();
    setIsProcessing(false);

    if (success) {
      setOrdered(true);
      actions.clearMessage();
      setTimeout(() => {
        setOrdered(false);
        navigate("/orders");
      }, 2500);
    }
  };

  if (ordered) {
    return (
      <div className="success-screen">
        <span className="success-screen__icon">🎉</span>
        <h2 className="page-header__title">¡Pedido confirmado!</h2>
        <p className="text-muted-theme">Tu pedido fue recibido. Te avisamos cuando esté en camino 🚚</p>
        <div className="success-screen__bar"></div>
      </div>
    );
  }

  if (store.cart.length === 0) {
    return (
      <div className="success-screen">
        <span className="success-screen__icon">🧺</span>
        <h3 className="page-header__title">Tu carrito está vacío</h3>
        <p className="text-muted-theme">Agregá productos frescos desde nuestra tienda</p>
        <Link to="/" className="btn btn-accent mt-2">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <PageHeader
          title="🧺 Tu carrito"
          subtitle={store.cart.length + " " + (store.cart.length === 1 ? "producto" : "productos") + " · Checkout"}
        />

        {store.error && (
          <div className="ui-alert ui-alert--error mb-4">
            <i className="fas fa-exclamation-circle"></i> {store.error}
          </div>
        )}

        <div className="checkout-layout">
          <div>
            <section className="checkout-panel mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h6 fw-bold mb-0">Productos</h2>
                <button type="button" className="btn btn-sm btn-outline-accent" onClick={() => actions.clearCart()}>
                  <i className="fas fa-trash me-1"></i> Vaciar
                </button>
              </div>

              {store.cart.map((item, idx) => (
                <div key={item.id} className={"d-flex align-items-center gap-3 py-3 " + (idx < store.cart.length - 1 ? "border-bottom-cart" : "")}>
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="checkout-summary__thumb"
                    onError={(e) => { e.currentTarget.src = fallbackProductImage(item); }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.name}</div>
                    <div className="text-muted-theme small">{item.category} · ${parseFloat(item.price).toFixed(2)} / {item.unit}</div>
                  </div>
                  <div className="qty-control">
                    <button type="button" className="qty-control__btn" onClick={() => actions.updateCartQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-control__value">{item.quantity}</span>
                    <button type="button" className="qty-control__btn" onClick={() => actions.updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="fw-bold text-accent text-end cart-line-price">
                    ${(item.price * item.quantity).toFixed(0)}
                  </div>
                  <button type="button" className="cart-drawer__remove" onClick={() => actions.removeFromCart(item.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}

              <Link to="/" className="ui-link small">
                <i className="fas fa-arrow-left me-1"></i> Seguir comprando
              </Link>
            </section>

            <section className="checkout-panel">
              <h2 className="h6 fw-bold mb-3">Envío</h2>
              {isProcessing ? (
                <div className="checkout-loading-box">
                  <div className="spinner-verde spinner-verde--lg" role="status"></div>
                </div>
              ) : (
                <p className="text-muted-theme small mb-0">
                  {shipping === 0 ? "🚚 Envío gratis aplicado a tu pedido" : "El envío se calcula según tu zona al finalizar."}
                </p>
              )}
            </section>
          </div>

          <aside className="checkout-summary">
            <h2 className="h6 fw-bold mb-3">Resumen del pedido</h2>

            {store.cart.slice(0, 4).map((item) => (
              <div key={item.id} className="checkout-summary__item">
                <div className="checkout-summary__thumb-wrap">
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="checkout-summary__thumb"
                    onError={(e) => { e.currentTarget.src = fallbackProductImage(item); }}
                  />
                  <span className="checkout-summary__qty-badge">{item.quantity}</span>
                </div>
                <span className="flex-grow-1 small fw-semibold">{item.name}</span>
                <span className="fw-bold text-accent">${(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}

            <div className="d-flex justify-content-between small text-muted-theme mb-2">
              <span>Subtotal</span>
              <span className="fw-semibold text-accent">${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small text-muted-theme mb-3">
              <span>Envío</span>
              <span className="fw-semibold">{shipping === 0 ? "Gratis 🚚" : "$" + shipping.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p className="small p-2 rounded mb-3 shipping-hint-free">
                Sumá ${(SHIPPING_THRESHOLD - subtotal).toFixed(0)} más para envío gratis
              </p>
            )}

            <hr className="ui-divider" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold">Total</span>
              <span className="price-tag mb-0">${total.toFixed(2)}</span>
            </div>

            {store.token ? (
              <button type="button" className="btn btn-accent btn-accent--block py-3" onClick={handleOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <><span className="spinner-verde me-2"></span> Procesando...</>
                ) : (
                  <><i className="fas fa-check-circle me-2"></i> Finalizar compra</>
                )}
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-accent btn-accent--block py-3 mb-2">
                  Iniciar sesión para comprar
                </Link>
                <p className="small text-muted-theme text-center mb-0">
                  ¿No tenés cuenta? <Link to="/signup" className="ui-link">Registrate</Link>
                </p>
              </>
            )}

            <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
              <span className="small text-muted-theme">🔒 Pago seguro</span>
              <span className="small text-muted-theme">🌿 Fresco garantizado</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
