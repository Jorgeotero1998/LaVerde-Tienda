import React, { useState, useEffect, useRef } from "react";
import { Context } from "./layout";
import getState from "./flux";
import { setUnauthorizedHandler } from "./api/client";

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    const [state, setState] = useState(null);
    const stateRef = useRef(null);

    useEffect(() => {
      const initialState = getState({
        getStore: () => stateRef.current.store,
        getActions: () => stateRef.current.actions,
        setStore: (updatedStore) =>
          setState((prev) => {
            const next = { ...prev, store: { ...prev.store, ...updatedStore } };
            stateRef.current = next;
            return next;
          }),
      });
      stateRef.current = initialState;
      setState(initialState);
    }, []);

    useEffect(() => {
      if (!state) return;
      setUnauthorizedHandler(() => {
        if (stateRef.current?.actions) stateRef.current.actions.logout();
      });
      state.actions.getProducts();
      if (state.store.token) state.actions.syncSession();
    }, [!!state]);

    if (!state) return null;

    return (
      <Context.Provider value={state}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };
  return StoreWrapper;
};

export default injectContext;
