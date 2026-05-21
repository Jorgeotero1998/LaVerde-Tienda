import { apiFetch, mapCartFromApi, mapFavoritesFromApi } from "./api/client";
import { CATALOG_FALLBACK } from "./data/catalogFallback";

const prodSample = CATALOG_FALLBACK;
const PRODUCTS_CACHE_KEY = "laverde_products_v2";

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
    products: prodSample,
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
      if (
        !firstName?.trim() ||
        !lastName?.trim() ||
        !email?.trim() ||
        !password?.trim()
      ) {
        setStore({ error: "Todos los campos son obligatorios." });
        return false;
      }
      try {
        await apiFetch("/signup", {
          method: "POST",
          body: { firstName, lastName, email, password },
          token: null,
        });
        setStore({
          error: null,
          message: "Cuenta creada con éxito. ¡Ya podés iniciar sesión!",
        });
        return true;
      } catch (err) {
        const isNetwork =
          err.message === "Failed to fetch" || err.name === "TypeError";
        setStore({
          error: isNetwork
            ? "No se pudo conectar al servidor. Ejecutá: python run_backend.py"
            : err.data?.error || err.message || "No se pudo crear la cuenta.",
        });
        return false;
      }
    },

    login: async (email, password) => {
      try {
        const data = await apiFetch("/login", {
          method: "POST",
          body: { email, password },
          token: null,
        });
        localStorage.setItem("laverde_token", data.token);
        localStorage.setItem("laverde_user", JSON.stringify(data.user));
        setStore({ token: data.token, user: data.user, error: null });
        await getActions().mergeGuestCartToApi();
        await getActions().fetchCart();
        await getActions().fetchFavorites();
        return true;
      } catch (err) {
        const isNetwork =
          err.message === "Failed to fetch" || err.name === "TypeError";
        setStore({
          error: isNetwork
            ? "No se pudo conectar al servidor. ¿Está corriendo el backend? (python run_backend.py en la raíz del proyecto)"
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
      try {
        const data = await apiFetch("/products", { token: null });
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
        localStorage.removeItem("laverde_products");
        setStore({ products: data });
      } catch {
        setStore({ products: prodSample });
      }
    },

    getProduct: (id) => {
      const store = getStore();
      const productMatch = store.products.find(
        (item) => Number(item.id) === Number(id),
      );
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

    createProduct: (data) => {
      const store = getStore();
      const newProduct = {
        ...data,
        id: Date.now(),
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
      };
      const updated = [...store.products, newProduct];
      localStorage.setItem("laverde_products", JSON.stringify(updated));
      setStore({ products: updated });
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

    deleteProduct: (id) => {
      const store = getStore();
      const updated = store.products.filter((p) => Number(p.id) !== Number(id));
      localStorage.setItem("laverde_products", JSON.stringify(updated));
      setStore({ products: updated });
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
        } catch (err) {
          setStore({
            error: err.data?.error || "No se pudo agregar al carrito.",
          });
        }
        return;
      }

      const store = getStore();
      const existing = store.cart.find(
        (item) => Number(item.id) === Number(product.id),
      );
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
      setStore({ cart: updatedCart });
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
      const updatedCart = store.cart.filter(
        (item) => Number(item.id) !== Number(productId),
      );
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
        Number(item.id) === Number(productId)
          ? { ...item, quantity: Number(quantity) }
          : item,
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
      const isFav = store.favorites.some(
        (f) => Number(f.product_id) === Number(productId),
      );

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
