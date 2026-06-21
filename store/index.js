// store/index.js
export const state = () => ({
  toast: null
})

export const mutations = {
  SET_TOAST(state, toast) {
    state.toast = toast
  }
}

export const actions = {
  showToast({ commit }, { message, type = 'success' }) {
    commit('SET_TOAST', { message, type })
    setTimeout(() => commit('SET_TOAST', null), 3000)
  }
}
