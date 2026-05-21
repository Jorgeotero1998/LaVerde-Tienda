import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../layout";
import { isFavoriteProduct } from "../utils/favoriteMatch";
import { fallbackProductImage, getProductImage } from "../utils/productImages";

const ProductCard = ({ product, animationDelay = 0 }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const isFav = isFavoriteProduct(store.favorites, product.id);

  const handleFav = (e) => {
    e.stopPropagation();
    if (store.token) actions.toggleFavorite(product.id);
  };

  const handleCart = (e) => {
    e.stopPropagation();
    actions.addToCart(product, 1);
    setJustAdded(true);
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
    setTimeout(() => setJustAdded(false), 900);
  };

  const goDetail = () => navigate("/product/" + product.id);

  return (
    <article
      className="product-card product-card--reveal"
      style={{ animationDelay: animationDelay + "s" }}
      onClick={goDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goDetail();
        }
      }}
    >
      <div className="product-card__media">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="product-img"
          onError={(e) => { e.currentTarget.src = fallbackProductImage(product); }}
        />
        <span className="product-card__price-badge">${product.price}</span>
        {store.token && (
          <button
            type="button"
            className={"fav-btn position-absolute top-0 start-0 m-3 " + (isFav ? "active" : "")}
            onClick={handleFav}
            aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <i className={(isFav ? "fas" : "far") + " fa-heart"}></i>
          </button>
        )}
        {product.stock === 0 && (
          <span className="badge bg-danger product-card__badge-stock">Sin stock</span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        <button
          type="button"
          className={"btn btn-accent product-card__cta " + (justAdded ? "product-card__cta--added" : "")}
          onClick={handleCart}
          disabled={product.stock === 0}
        >
          <i className="fas fa-shopping-cart"></i> Agregar al carrito
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
