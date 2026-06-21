export default {
  head: {
    title: 'FoodieHub — Katalog Makanan & Minuman',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Temukan makanan, minuman, dan cemilan favoritmu dengan harga terbaik di FoodieHub.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap' }
    ]
  },
  css: [
    '~/assets/css/main.css'
  ],
  plugins: [
    '~/plugins/cart.client.js'
  ],
  components: true,
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: '/'
  },
  build: {}
}
