// plugins/cart.client.js
export default ({ store }) => {
  // Initialize cart from localStorage
  store.dispatch('cart/initCart')
  
  // Fetch products from Google Sheet
  store.dispatch('products/fetchProductsFromSheet')
}
