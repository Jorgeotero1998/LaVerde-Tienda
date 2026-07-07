import { apiFetch, apiEnsureBackendReady, mapCartFromApi, mapFavoritesFromApi } from "./api/client";
import { CATALOG_FALLBACK } from "./data/catalogFallback";

const prodSample = CATALOG_FALLBACK;
const PRODUCTS_CACHE_KEY = "laverde_products_v2";

const readCachedProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
};

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem("laverde_cart") || "[]");
  } catch {
    return [];
  }
};

const saveGuestCart = (cart) => {
  localStorage.setItem("laverde_cart", JSON.stringify(cart));
};

const getState = ({ getStore, getActions, setStore }) => ({
  store: {
    products: readCachedProducts() || prodSample,
    productsLoading: false,
    productsSource: readCachedProducts() ? "cache" : "fallback",
    product: {},
    cart: readGuestCart(),
    favorites: [],
    orders: [],
    token: localStorage.getItem("laverde_token") || null,
    user: JSON.parse(localStorage.getItem("laverde_user") || "null"),
    error: null,
    message: null,
  },

  actions: {
    clearMessage: () => setStore({ message: null, error: null }),

    fetchCart: async () => {
      const { token } = getStore();
      if (!token) return;
      try {
        const data = await apiFetch("/cart");
        const cart = mapCartFromApi(data);
        setStore({ cart });
      } catch {
        setStore({ cart: [] });
      }
    },

    fetchFavorites: async () => {
      const { token } = getStore();
      if (!token) {
        setStore({ favorites: [] });
        return;
      }
      try {
        const data = await apiFetch("/favorites");
        setStore({ favorites: mapFavoritesFromApi(data) });
      } catch {
        setStore({ favorites: [] });
      }
    },

    mergeGuestCartToApi: async () => {
      const guest = readGuestCart();
      for (const item of guest) {
        try {
          await apiFetch("/cart", {
            method: "POST",
            body: { product_id: item.id, quantity: item.quantity || 1 },
          });
        } catch {
          /* item ya en carrito o sin stock */
        }
      }
      localStorage.removeItem("laverde_cart");
    },

    syncSession: async () => {
      const { token } = getStore();
      if (!token) return;
      try {
        const user = await apiFetch("/me");
        localStorage.setItem("laverde_user", JSON.stringify(user));
        setStore({ user });
        await getActions().mergeGuestCartToApi();
        await getActions().fetchCart();
        await getActions().fetchFavorites();
      } catch {
        getActions().logout();
      }
    },

    signup: async (firstName, lastName, email, password) => {
      if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
        setStore({ error: "Todos los campos son obligatorios." });
        return false;
      }
      const attemptSignup = async () =>
        apiFetch("/signup", {
          method: "POST",
          body: { firstName, lastName, email, password },
          token: null,
        });

      try {
        try {
          await attemptSignup();
        } catch (err) {
          if (err.status >= 500 || err.status === 503) {
            await apiEnsureBackendReady();
            await new Promise((r) => setTimeout(r, 1500));
            await attemptSignup();
          } else {
            throw err;
          }
        }
        setStore({
          error: null,
          message: "Cuenta creada con éxito. ¡Ya podés iniciar sesión!",
        });
        return true;
      } catch (err) {
        const isNetwork =
          err.message === "Failed to fetch" ||
          err.name === "TypeError" ||
          err.name === "AbortError";
        const isServer = err.status >= 500;
        setStore({
          error: isNetwork
            ? "El servidor está despertando. Esperá ~30s e intentá registrarte de nuevo."
            : isServer
              ? "Error del servidor al crear la cuenta. Reintentá en unos segundos."
              : err.data?.error || err.message || "No se pudo crear la cuenta.",
        });
        return false;
      }
    },

    login: async (email, password) => {
      const attemptLogin = async () =>
        apiFetch("/login", {
          method: "POST",
          body: { email, password },
          token: null,
          retries: 2,
        });

      try {
        let data;
        try {
          data = await attemptLogin();
        } catch (err) {
          if (err.status >= 500 || err.status === 503) {
            await apiEnsureBackendReady();
            await new Promise((r) => setTimeout(r, 1500));
            data = await attemptLogin();
          } else {
            throw err;
          }
        }
        localStorage.setItem("laverde_token", data.token);
        localStorage.setItem("laverde_user", JSON.stringify(data.user));
        setStore({ token: data.token, user: data.user, error: null });
        await getActions().mergeGuestCartToApi();
        await getActions().fetchCart();
        await getActions().fetchFavorites();
        return true;
      } catch (err) {
        const isNetwork =
          err.message === "Failed to fetch" ||
          err.name === "TypeError" ||
          err.name === "AbortError";
        const isServer = err.status >= 500;
        setStore({
          error: isNetwork
            ? "El servidor está despertando (Render free tier). Esperá ~30s e intentá de nuevo."
            : isServer
              ? "Error del servidor al iniciar sesión. El backend puede estar reiniciando la base de datos — reintentá en unos segundos."
              : err.data?.error || "Email o contraseña incorrectos.",
        });
        return false;
      }
    },

    logout: () => {
      localStorage.removeItem("laverde_token");
      localStorage.removeItem("laverde_user");
      localStorage.removeItem("laverde_cart");
      setStore({
        token: null,
        user: null,
        cart: [],
        favorites: [],
        orders: [],
      });
    },

    getProducts: async () => {
      const cached = readCachedProducts();
      setStore({
        productsLoading: true,
        ...(cached ? { products: cached, productsSource: "cache" } : {}),
      });
      try {
        const data = await apiFetch("/products", { token: null, retries: 2 });
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
        localStorage.removeItem("laverde_products");
        setStore({ products: data, productsLoading: false, productsSource: "api" });
      } catch {
        const fallback = cached || prodSample;
        setStore({
          products: fallback,
          productsLoading: false,
          productsSource: cached ? "cache" : "fallback",
        });
      }
    },

    getProduct: (id) => {
      const store = getStore();
      const productMatch = store.products.find((item) => Number(item.id) === Number(id));
      setStore({ product: productMatch || {} });
    },

    getOrders: async () => {
      const { token } = getStore();
      if (!token) return;
      try {
        const orders = await apiFetch("/orders");
        setStore({ orders });
      } catch {
        setStore({ orders: [] });
      }
    },

    createProduct: async (data) => {
      try {
        await apiFetch("/products", {
          method: "POST",
          body: {
            name: data.name,
            description: data.description || "",
            price: Number(data.price) || 0,
            stock: Number(data.stock) || 0,
            unit: data.unit || "pza",
            category: data.category || "",
            image_url: data.image_url || "",
          },
        });
        await getActions().getProducts();
        setStore({ message: "Producto creado con éxito." });
      } catch (err) {
        setStore({ error: err.data?.error || "No se pudo crear el producto." });
      }
    },

    updateProduct: (id, data) => {
      const store = getStore();
      const updated = store.products.map((p) =>
        Number(p.id) === Number(id)
          ? {
              ...p,
              ...data,
              price: data.price !== undefined ? Number(data.price) : p.price,
              stock: data.stock !== undefined ? Number(data.stock) : p.stock,
            }
          : p,
      );
      localStorage.setItem("laverde_products", JSON.stringify(updated));
      setStore({ products: updated });
    },

    deleteProduct: async (id) => {
      try {
        await apiFetch(`/products/${id}`, { method: "DELETE" });
        await getActions().getProducts();
        setStore({ message: "Producto eliminado." });
      } catch (err) {
        setStore({ error: err.data?.error || "No se pudo eliminar el producto." });
      }
    },

    addToCart: async (product, quantity = 1) => {
      const { token } = getStore();
      if (token) {
        try {
          await apiFetch("/cart", {
            method: "POST",
            body: { product_id: product.id, quantity },
          });
          await getActions().fetchCart();
          setStore({ message: `${product.name} agregado al carrito`, error: null });
        } catch (err) {
          setStore({
            error: err.data?.error || "No se pudo agregar al carrito.",
          });
        }
        return;
      }

      const store = getStore();
      const existing = store.cart.find((item) => Number(item.id) === Number(product.id));
      let updatedCart;
      if (existing) {
        updatedCart = store.cart.map((item) =>
          Number(item.id) === Number(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        updatedCart = [...store.cart, { ...product, quantity }];
      }
      saveGuestCart(updatedCart);
      setStore({ cart: updatedCart, message: `${product.name} agregado al carrito`, error: null });
    },

    removeFromCart: async (productId) => {
      const { token } = getStore();
      if (token) {
        try {
          await apiFetch(`/cart/${productId}`, { method: "DELETE" });
          await getActions().fetchCart();
        } catch {
          /* ignore */
        }
        return;
      }

      const store = getStore();
      const updatedCart = store.cart.filter((item) => Number(item.id) !== Number(productId));
      saveGuestCart(updatedCart);
      setStore({ cart: updatedCart });
    },

    updateCartQuantity: async (productId, quantity) => {
      if (quantity <= 0) {
        await getActions().removeFromCart(productId);
        return;
      }

      const { token } = getStore();
      if (token) {
        try {
          await apiFetch(`/cart/${productId}`, {
            method: "PUT",
            body: { quantity: Number(quantity) },
          });
          await getActions().fetchCart();
        } catch {
          /* ignore */
        }
        return;
      }

      const store = getStore();
      const updatedCart = store.cart.map((item) =>
        Number(item.id) === Number(productId) ? { ...item, quantity: Number(quantity) } : item,
      );
      saveGuestCart(updatedCart);
      setStore({ cart: updatedCart });
    },

    clearCart: async () => {
      const { token } = getStore();
      if (token) {
        try {
          await apiFetch("/cart", { method: "DELETE" });
        } catch {
          /* ignore */
        }
      }
      localStorage.removeItem("laverde_cart");
      setStore({ cart: [] });
    },

    checkoutOrder: async () => {
      const { token, cart } = getStore();
      if (!token) {
        setStore({ error: "Iniciá sesión para confirmar tu pedido." });
        return false;
      }
      if (!cart.length) {
        setStore({ error: "Tu carrito está vacío." });
        return false;
      }
      try {
        await apiFetch("/orders", { method: "POST" });
        await getActions().fetchCart();
        setStore({ message: "Pedido confirmado con éxito." });
        return true;
      } catch (err) {
        setStore({
          error: err.data?.error || "No se pudo procesar el pedido.",
        });
        return false;
      }
    },

    toggleFavorite: async (productId) => {
      const { token } = getStore();
      if (!token) {
        setStore({ error: "Iniciá sesión para guardar favoritos." });
        return;
      }

      const store = getStore();
      const isFav = store.favorites.some((f) => Number(f.product_id) === Number(productId));

      try {
        if (isFav) {
          await apiFetch(`/favorites/${productId}`, { method: "DELETE" });
        } else {
          await apiFetch("/favorites", {
            method: "POST",
            body: { product_id: productId },
          });
        }
        await getActions().fetchFavorites();
      } catch (err) {
        setStore({
          error: err.data?.error || "No se pudo actualizar favoritos.",
        });
      }
    },

    forgotPassword: async (email) => {
      if (!email?.trim()) {
        setStore({ error: "Ingresá tu email." });
        return false;
      }
      try {
        await apiFetch("/forgot-password", {
          method: "POST",
          body: { email },
          token: null,
        });
        setStore({ error: null, message: null });
        return true;
      } catch (err) {
        setStore({
          error: err.data?.error || "No encontramos una cuenta con ese email.",
        });
        return false;
      }
    },

    updateProfile: async (fields) => {
      const { token } = getStore();
      if (!token) return;
      try {
        const user = await apiFetch("/me", {
          method: "PUT",
          body: fields,
        });
        localStorage.setItem("laverde_user", JSON.stringify(user));
        setStore({
          user,
          message: "Perfil actualizado con éxito.",
          error: null,
        });
      } catch (err) {
        setStore({
          error: err.data?.error || "No se pudo actualizar el perfil.",
        });
      }
    },
  },
});

export default getState;
