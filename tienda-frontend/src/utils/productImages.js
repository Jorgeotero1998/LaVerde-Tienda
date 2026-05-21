export const DEFAULT_PRODUCT_IMAGE = "/product-images/lechuga-bola.jpg";

const PRODUCT_IMAGES = {
  "manzana roja": "/product-images/manzana-roja.jpg",
  banana: "/product-images/banana.jpg",
  "naranja valencia": "/product-images/naranja-valencia.jpg",
  limon: "/product-images/limon.jpg",
  "palta hass": "/product-images/palta-hass.jpg",
  frutilla: "/product-images/frutilla.jpg",
  "uva verde": "/product-images/uva-verde.jpg",
  "pera williams": "/product-images/pera-williams.jpg",
  "lechuga bola": "/product-images/lechuga-bola.jpg",
  "tomate perita": "/product-images/tomate-perita.jpg",
  zanahoria: "/product-images/zanahoria.jpg",
  "cebolla blanca": "/product-images/cebolla-blanca.jpg",
  papa: "/product-images/papa.jpg",
  "morron rojo": "/product-images/morron-rojo.jpg",
  "zapallo cabutia": "/product-images/zapallo-cabutia.jpg",
  pepino: "/product-images/pepino.jpg",
  espinaca: "/product-images/espinaca.jpg",
  brocoli: "/product-images/brocoli.jpg",
  albahaca: "/product-images/albahaca.jpg",
  perejil: "/product-images/perejil.jpg",
  cilantro: "/product-images/cilantro.jpg",
  "oregano seco": "/product-images/oregano-seco.jpg",
  ajo: "/product-images/ajo.jpg",
  "huevo rojo": "/product-images/huevo-rojo.jpg",
  "pechuga de pollo": "/product-images/pechuga-de-pollo.jpg",
  "queso crema": "/product-images/queso-crema.jpg",
  "leche entera": "/product-images/leche-entera.jpg",
};

const normalizeName = (name = "") =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const hasGenericImage = (url = "") => {
  const value = url.toLowerCase();
  return (
    !value ||
    value.includes("placehold") ||
    value.includes("upload.wikimedia.org") ||
    value.includes("unsplash") ||
    value.includes("encrypted-tbn") ||
    value.includes("clickabasto") ||
    value.includes("grillhouse") ||
    value.startsWith("data:image/svg+xml")
  );
};

export const fallbackProductImage = (product) =>
  PRODUCT_IMAGES[normalizeName(product?.name)] || DEFAULT_PRODUCT_IMAGE;

export const getProductImage = (product) => {
  const imageUrl = product?.image_url?.trim();
  const fallback = fallbackProductImage(product);

  if (fallback !== DEFAULT_PRODUCT_IMAGE && hasGenericImage(imageUrl)) {
    return fallback;
  }

  return imageUrl || fallback;
};
