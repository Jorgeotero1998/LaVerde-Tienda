import React, { useContext } from "react";
import { Context } from "../layout";

const SyncBanner = () => {
  const { store } = useContext(Context);

  if (store.productsLoading) {
    return (
      <div className="sync-banner sync-banner--loading" role="status" aria-live="polite">
        <span className="spinner-verde me-2" aria-hidden="true"></span>
        Sincronizando catálogo con el servidor…
      </div>
    );
  }

  if (store.productsSource === "fallback") {
    return (
      <div className="sync-banner sync-banner--offline" role="status">
        <i className="fas fa-cloud me-2" aria-hidden="true"></i>
        Modo demo — el backend está despertando. Los productos se muestran desde caché local.
      </div>
    );
  }

  return null;
};

export default SyncBanner;
