import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Context } from "../layout";
import { isFavoriteProduct } from "../utils/favoriteMatch";
import { fallbackProductImage, getProductImage } from "../utils/productImages";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const ProductCard = ({ product, animationDelay = 0 }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const reduced = usePrefersReducedMotion();
  const isFav = isFavoriteProduct(store.favorites, product.id);
  const cardRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], reduced ? [0, 0] : [9, -9]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], reduced ? [0, 0] : [-9, 9]), {
    stiffness: 260,
    damping: 22,
  });

  const handlePointerMove = (e) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
  };

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
    <motion.article
      ref={cardRef}
      className="product-card product-card--tilt glass-panel"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { y: -6 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
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
          onError={(e) => {
            e.currentTarget.src = fallbackProductImage(product);
          }}
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
        <span className="category-chip product-card__chip">{product.category}</span>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        <motion.button
          type="button"
          className={
            "btn btn-accent product-card__cta " + (justAdded ? "product-card__cta--added" : "")
          }
          onClick={handleCart}
          disabled={product.stock === 0}
          whileTap={reduced ? {} : { scale: 0.97 }}
        >
          <i className="fas fa-shopping-cart"></i> Agregar al carrito
        </motion.button>
      </div>
    </motion.article>
  );
};

export default ProductCard;
