import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../layout";
import PageHeader from "../components/PageHeader";

const Orders = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getOrders();
  }, []);

  const orders = store.orders || [];

  return (
    <div className="page page--narrow">
      <div className="container">
        <PageHeader
          title="Mis pedidos"
          subtitle={
            orders.length
              ? orders.length + (orders.length === 1 ? " pedido" : " pedidos")
              : "Historial de compras"
          }
        />

        {orders.length === 0 ? (
          <div className="empty-state ui-panel">
            <span className="success-screen__icon" aria-hidden="true">
              <i className="fas fa-receipt"></i>
            </span>
            <h3 className="page-header__title">Todavía no tenés pedidos</h3>
            <p className="text-muted-theme">Cuando confirmes una compra, aparecerá acá.</p>
            <Link to="/" className="btn btn-accent mt-2">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="ui-panel orders-list__item mb-3">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                  <div>
                    <h3 className="h6 fw-bold mb-1">Pedido #{order.id}</h3>
                    <p className="text-muted-theme small mb-0">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString("es-AR")
                        : "Fecha no disponible"}
                    </p>
                  </div>
                  <span className="category-chip">{order.status || "confirmado"}</span>
                </div>
                <p className="mb-2">
                  <strong className="text-accent">${Number(order.total).toFixed(0)}</strong>
                  <span className="text-muted-theme small">
                    {" "}
                    · {(order.items || []).length}{" "}
                    {(order.items || []).length === 1 ? "producto" : "productos"}
                  </span>
                </p>
                <ul className="orders-list__products mb-0">
                  {(order.items || []).map((line) => (
                    <li key={line.id} className="small text-muted-theme">
                      {line.quantity}x {line.product?.name || "Producto"} — $
                      {(line.unit_price * line.quantity).toFixed(0)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
