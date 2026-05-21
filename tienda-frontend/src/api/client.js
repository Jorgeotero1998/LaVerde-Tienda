export const getApiBase = () =>
  (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:3001") + "/api";

export const getToken = () => localStorage.getItem("laverde_token");

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export const apiFetch = async (path, options = {}) => {
  const token = options.token !== undefined ? options.token : getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(getApiBase() + path, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || "Error en la solicitud");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

/** Sube imagen a Cloudinary vía backend (requiere rol admin). */
export const apiUploadImage = async (file) => {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(getApiBase() + "/upload/image", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  if (!res.ok) {
    const err = new Error(data?.error || "No se pudo subir la imagen");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const mapCartFromApi = (items) =>
  (items || []).map((item) => {
    const p = item.product || {};
    return {
      ...p,
      id: p.id ?? item.product_id,
      quantity: item.quantity,
      cartItemId: item.id,
    };
  });

export const mapFavoritesFromApi = (items) =>
  (items || []).map((f) => ({ product_id: f.product_id }));
