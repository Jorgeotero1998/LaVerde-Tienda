import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../layout";
import ProductCard from "../components/ProductCard";
import PageHeader from "../components/PageHeader";
import { isFavoriteProduct } from "../utils/favoriteMatch";

const Favorites = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getProducts();
  }, []);

  const favProducts = (store.products || []).filter((p) =>
    isFavoriteProduct(store.favorites, p.id)
  );

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          title="❤️ Mis favoritos"
          subtitle={favProducts.length + " " + (favProducts.length === 1 ? "producto guardado" : "productos guardados")}
        />

        {favProducts.length === 0 ? (
          <div className="empty-state ui-panel">
            <span className="success-screen__icon">🤍</span>
            <h3 className="page-header__title">Aún no guardaste favoritos</h3>
            <p className="text-muted-theme">Presioná el ❤️ en cualquier producto para guardarlo acá</p>
            <Link to="/" className="btn btn-accent mt-2">Explorar productos</Link>
          </div>
        ) : (
          <div className="product-grid">
            {favProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} animationDelay={0.05 + i * 0.06} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
