import React from "react";

const ProductSkeleton = ({ count = 8 }) => (
  <div className="product-grid" aria-busy="true" aria-label="Cargando productos">
    {Array.from({ length: count }, (_, i) => (
      <article key={i} className="product-skeleton" style={{ animationDelay: i * 0.05 + "s" }}>
        <div className="product-skeleton__media" />
        <div className="product-skeleton__body">
          <div className="product-skeleton__line product-skeleton__line--title" />
          <div className="product-skeleton__line product-skeleton__line--desc" />
          <div className="product-skeleton__line product-skeleton__line--btn" />
        </div>
      </article>
    ))}
  </div>
);

export default ProductSkeleton;
