import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../layout";
import ProductCard from "../components/ProductCard";
import { fallbackProductImage, getProductImage } from "../utils/productImages";

const ProductDetail = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    actions.getProduct(id);
    window.scrollTo(0, 0);
  }, [id]);

  const product = store.product;

  const handleAdd = () => {
    actions.addToCart(product, quantity);
    setAdded(true);
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product || !product.id) {
    return (
      <div className="empty-state">
        <span className="success-screen__icon">🌱</span>
        <p className="text-muted-theme">Cargando producto...</p>
        <span className="spinner-verde spinner-verde--lg mt-2"></span>
      </div>
    );
  }

  const related = store.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumb-nav">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/#productos">{product.category}</Link>
          <span>/</span>
          <span className="breadcrumb-nav__current">{product.name}</span>
        </nav>

        <div className="row g-5 align-items-start">
          <div className="col-md-5">
            <div className="product-detail__image-wrap">
              <img
                src={getProductImage(product)}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = fallbackProductImage(product); }}
              />
            </div>
          </div>

          <div className="col-md-7">
            <span className="badge-fresh mb-3 d-inline-flex">🌿 100% Fresco y Natural</span>
            <span className="category-chip d-block mb-2 w-auto">{product.category}</span>
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="text-muted-theme mb-4">{product.description}</p>

            <div className="d-flex align-items-baseline gap-2 mb-3">
              <span className="price-tag">${parseFloat(product.price || 0).toFixed(2)}</span>
              <span className="text-muted-theme">por {product.unit}</span>
            </div>

            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="badge-stock-ok">✅ Stock: {product.stock} {product.unit}</span>
              ) : (
                <span className="badge-stock-no">❌ Sin stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="qty-control">
                  <button type="button" className="qty-control__btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span className="qty-control__value">{quantity}</span>
                  <button type="button" className="qty-control__btn" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>

                <button
                  type="button"
                  className={"btn btn-accent flex-grow-1 " + (added ? "product-card__cta--added" : "")}
                  onClick={handleAdd}
                >
                  {added ? (
                    <><i className="fas fa-check me-2"></i> ¡Agregado!</>
                  ) : (
                    <><i className="fas fa-shopping-cart me-2"></i> Agregar al carrito</>
                  )}
                </button>
              </div>
            )}

            <div className="product-detail__perks">
              {[{ icon: "🚚", text: "Envío el mismo día" }, { icon: "🌿", text: "Producto fresco" }, { icon: "✅", text: "Calidad garantizada" }].map(({ icon, text }) => (
                <div key={text} className="product-detail__perk">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-5 pt-4">
            <h2 className="catalog-main__title mb-4">También te puede gustar 🛒</h2>
            <div className="product-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} animationDelay={0.05 + i * 0.06} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
