// The one place the website looks up product photos.
//
// `virtual:product-images` is generated from public/Products_images by
// build/productImagesPlugin.js: { "<imageName>": [view 1 URL, view 2 URL, ...] }.
// Products name their photos with `imageName` in shared/products.js.
import manifest from 'virtual:product-images';

/** All photos of a product, view 1 first. Falls back to the product's main image. */
export function getProductImages(product) {
  const views = product?.imageName ? manifest[product.imageName] : null;
  if (views?.length) return views;
  return product?.image ? [product.image] : [];
}
