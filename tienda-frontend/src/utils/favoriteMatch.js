/** Compara favorito con producto aunque el id venga como string o número */
export const isFavoriteProduct = (favorites, productId) =>
  favorites.some((f) => Number(f.product_id) === Number(productId));
