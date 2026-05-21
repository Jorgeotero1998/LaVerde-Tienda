import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../layout";

const AdminRoute = ({ children }) => {
  const { store } = useContext(Context);

  if (!store.token) {
    return <Navigate to="/login" replace />;
  }

  if (!store.user?.isAdmin) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state ui-panel">
            <h2 className="page-header__title">Acceso restringido</h2>
            <p className="text-muted-theme">
              Esta sección es solo para administradores de La Verde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
