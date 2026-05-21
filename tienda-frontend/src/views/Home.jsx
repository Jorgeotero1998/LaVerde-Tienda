import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Context } from "../layout";
import ProductCard from "../components/ProductCard";

const SIDEBAR_CATEGORIES = [
  { id: "Todos", label: "Todos", emoji: "🧺" },
  { id: "Frutas", label: "Frutas", emoji: "🍎" },
  { id: "Cítricos", label: "Cítricos", emoji: "🍊" },
  { id: "Verduras", label: "Verduras", emoji: "🥬" },
  { id: "Pecuarios", label: "Pecuarios", emoji: "🥚" },
  { id: "Hierbas", label: "Hierbas", emoji: "🌿" },
  { id: "Condimentos", label: "Condimentos", emoji: "🫚" },
];

const Home = () => {
  const { store, actions } = useContext(Context);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => { actions.getProducts(); }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    if (window.location.hash === "#productos") {
      setTimeout(() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" }), 200);
    }
  }, []);

  const apiCategories = ["Todos", ...new Set((store.products || []).map((p) => p.category).filter(Boolean))];
  const sidebarItems = SIDEBAR_CATEGORIES.filter(
    (c) => c.id === "Todos" || apiCategories.includes(c.id)
  );

  const filtered = (store.products || []).filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-home">
      <section className="hero-banner">
        <div className="container hero-banner__content">
          <h1 className="hero-banner__title">Frescura directa a tu hogar</h1>
          <p className="hero-banner__subtitle">
            Productos frescos, orgánicos y de temporada. Directo del productor, con entrega en el día para mantener la mejor calidad.
          </p>
          <a href="#productos" className="btn btn-accent hero-banner__cta">
            Explorar productos <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </section>

      <section id="productos" className="catalog-section">
        <div className="container">
          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <h2 className="catalog-sidebar__title">Categorías</h2>
              <ul className="catalog-sidebar__list">
                {sidebarItems.map(({ id, label, emoji }) => (
                  <li key={id}>
                    <button
                      type="button"
                      className={"catalog-sidebar__option " + (activeCategory === id ? "is-active" : "")}
                      onClick={() => setActiveCategory(id)}
                    >
                      <span className="catalog-sidebar__radio" aria-hidden="true"></span>
                      <span aria-hidden="true">{emoji}</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="catalog-main">
              <header className="catalog-main__header">
                <h2 className="catalog-main__title">Nuestros productos</h2>
                <p className="catalog-main__subtitle">
                  {filtered.length} de {store.products?.length || 0} productos frescos
                  {search ? " · Búsqueda: \"" + search + "\"" : ""}
                </p>
              </header>

              <div className="product-grid">
                {filtered.length === 0 ? (
                  <p className="text-muted-theme col-12">No encontramos productos con esos filtros.</p>
                ) : (
                  filtered.map((item, index) => (
                    <ProductCard key={item.id} product={item} animationDelay={0.05 + index * 0.06} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
