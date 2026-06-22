// store/cart.js
export const state = () => ({
  items: [],
  isOpen: false
})

export const getters = {
  cartItems: (state) => state.items,

  cartCount: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),

  cartTotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),

  isOpen: (state) => state.isOpen,

  isInCart: (state) => (productId) => state.items.some(item => item.id === productId)
}

export const mutations = {
  SET_ITEMS(state, items) {
    state.items = items
  },

  ADD_ITEM(state, product) {
    const existing = state.items.find(item => item.id === product.id)
    if (existing) {
      existing.qty += product.qty || 1
    } else {
      state.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        qty: product.qty || 1
      })
    }
  },

  REMOVE_ITEM(state, productId) {
    state.items = state.items.filter(item => item.id !== productId)
  },

  UPDATE_QTY(state, { productId, qty }) {
    const item = state.items.find(item => item.id === productId)
    if (item) {
      if (qty <= 0) {
        state.items = state.items.filter(i => i.id !== productId)
      } else {
        item.qty = qty
      }
    }
  },

  CLEAR_CART(state) {
    state.items = []
  },

  TOGGLE_CART(state) {
    state.isOpen = !state.isOpen
  },

  SET_CART_OPEN(state, val) {
    state.isOpen = val
  }
}

export const actions = {
  initCart({ commit }) {
    try {
      const saved = localStorage.getItem('andamart_cart')
      if (saved) {
        commit('SET_ITEMS', JSON.parse(saved))
      }
    } catch (e) {}
  },

  addToCart({ commit, state }, product) {
    commit('ADD_ITEM', product)
    localStorage.setItem('andamart_cart', JSON.stringify(state.items))
  },

  removeFromCart({ commit, state }, productId) {
    commit('REMOVE_ITEM', productId)
    localStorage.setItem('andamart_cart', JSON.stringify(state.items))
  },

  updateQty({ commit, state }, payload) {
    commit('UPDATE_QTY', payload)
    localStorage.setItem('andamart_cart', JSON.stringify(state.items))
  },

  clearCart({ commit }) {
    commit('CLEAR_CART')
    localStorage.removeItem('andamart_cart')
  },

  toggleCart({ commit }) {
    commit('TOGGLE_CART')
  },

  openCart({ commit }) {
    commit('SET_CART_OPEN', true)
  },

  closeCart({ commit }) {
    commit('SET_CART_OPEN', false)
  }
}
