import React, { useContext, useEffect, useRef } from "react";
import { Context } from "../layout";

const ToastHost = () => {
  const { store, actions } = useContext(Context);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!store.error && !store.message) return undefined;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => actions.clearMessage(), 4200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [store.error, store.message, actions]);

  if (!store.error && !store.message) return null;

  const isError = Boolean(store.error);
  const text = store.error || store.message;

  return (
    <div className="toast-host" role="status" aria-live="polite" aria-atomic="true">
      <div
        className={
          "toast-host__item " + (isError ? "toast-host__item--error" : "toast-host__item--success")
        }
      >
        <i
          className={"fas " + (isError ? "fa-exclamation-circle" : "fa-check-circle")}
          aria-hidden="true"
        ></i>
        <span>{text}</span>
        <button
          type="button"
          className="toast-host__close"
          onClick={() => actions.clearMessage()}
          aria-label="Cerrar notificación"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};

export default ToastHost;
