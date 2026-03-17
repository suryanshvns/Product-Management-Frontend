/**
 * Resolve first product image URL from various API shapes.
 * - Product list: data.items[].images[].imageUrl
 * - Single product: data.product.images[].imageUrl
 * - Top products: data.products[].images[].imageUrl
 * - Products by category: data.categories[].products[].images[].imageUrl
 */
export function getProductImageUrl(product) {
  if (!product) return null;
  const images = product.images ?? product.product?.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    return first?.imageUrl ?? first?.url ?? first?.src ?? null;
  }
  return product.imageUrl ?? product.image ?? product.thumbnail ?? null;
}
