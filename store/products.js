// store/products.js
import { fetchProducts, addProductToSheet, updateProductToSheet, deleteProductFromSheet } from '~/services/sheetService'

export const state = () => ({
  products: [],
  loading: false,
  error: null
})

export const getters = {
  allProducts: (state) => state.products,

  filteredProducts: (state) => (category, sortBy) => {
    let list = [...state.products]

    if (category && category !== 'semua') {
      list = list.filter(p => p.category === category)
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'bestseller') {
      list = list.filter(p => p.isBestseller).concat(list.filter(p => !p.isBestseller))
      list.sort((a, b) => b.sold - a.sold)
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else {
      list.sort((a, b) => b.sold - a.sold)
    }

    return list
  },

  productById: (state) => (id) => {
    return state.products.find(p => p.id === parseInt(id))
  },

  relatedProducts: (state) => (category, excludeId) => {
    return state.products
      .filter(p => p.category === category && p.id !== excludeId)
      .slice(0, 4)
  }
}

export const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  ADD_PRODUCT(state, product) {
    // Jika product belum ada id, kita buatkan
    const newId = product.id || (state.products.length > 0
      ? Math.max(...state.products.map(p => p.id)) + 1
      : 1)

    state.products.push({
      ...product,
      id: newId
    })
  },

  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },

  DELETE_PRODUCT(state, id) {
    state.products = state.products.filter(p => p.id !== id)
  }
}

export const actions = {
  async fetchProductsFromSheet({ commit }) {
    commit('SET_LOADING', true)
    try {
      const products = await fetchProducts()
      commit('SET_PRODUCTS', products)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Failed to fetch products from sheet:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addProduct({ commit, state }, product) {
    commit('SET_LOADING', true)
    try {
      // Buat ID baru berdasarkan max id yang ada
      const newId = state.products.length > 0
        ? Math.max(...state.products.map(p => p.id)) + 1
        : 1

      // Menambahkan id baru dan default values
      const newProduct = {
        ...product,
        id: newId,
        rating: 4.5,
        sold: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }

      // Karena Google Drive menolak dijadikan tempat hosting gambar website (Error 403 & 429)
      // Kita kembalikan ke sistem lokal yang terjamin 100% jalan di Laragon Anda.
      if (newProduct.image && newProduct.image.startsWith('data:image')) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newProduct.image })
        })
        const resData = await response.json()
        if (resData.url) {
          newProduct.image = resData.url
        } else {
          throw new Error('Gagal upload ke server lokal')
        }
      }

      // Kirim data ke Sheet
      await addProductToSheet(newProduct)

      // Jika berhasil, update state Vuex
      commit('ADD_PRODUCT', newProduct)
    } catch (error) {
      console.error('Gagal menambahkan produk ke sheet:', error)
      throw error // dilempar agar komponen tahu kalau gagal
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProduct({ commit }, product) {
    commit('SET_LOADING', true)
    try {
      const updatedProduct = { ...product }
      if (updatedProduct.image && updatedProduct.image.startsWith('data:image')) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: updatedProduct.image })
        })
        const resData = await response.json()
        if (resData.url) {
          updatedProduct.image = resData.url
        } else {
          throw new Error('Gagal upload ke server lokal')
        }
      }

      await updateProductToSheet(updatedProduct)
      commit('UPDATE_PRODUCT', updatedProduct)
    } catch (error) {
      console.error('Gagal update produk di sheet:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteProduct({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await deleteProductFromSheet(id)
      commit('DELETE_PRODUCT', id)
    } catch (error) {
      console.error('Gagal hapus produk dari sheet:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
