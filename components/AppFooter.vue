<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">🍔 FoodieHub</span>
        <p class="footer-tagline">Temukan makanan, minuman & cemilan favoritmu</p>
      </div>
      <div class="footer-links">
        <!-- <nuxt-link to="/">Katalog</nuxt-link>
        <nuxt-link to="/?cat=makanan">Makanan</nuxt-link>
        <nuxt-link to="/?cat=minuman">Minuman</nuxt-link>
        <nuxt-link to="/?cat=cemilan">Cemilan</nuxt-link> -->
        <!-- <nuxt-link to="/admin">Admin</nuxt-link> -->
      </div>
      <p class="footer-copy">© {{ year }} FoodieHub. Dibuat dengan ❤️</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    year() { return new Date().getFullYear() }
  }
}
</script>

<style scoped>
.app-footer {
  background: var(--bg-dark);
  color: rgba(255,255,255,0.7);
  padding: 40px 0 24px;
  margin-top: 80px;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}
.footer-logo {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 800;
  color: white;
  display: block;
  margin-bottom: 8px;
}
.footer-tagline {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
}
.footer-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.footer-links a {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  transition: color var(--transition);
}
.footer-links a:hover { color: var(--primary); }
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.35);
  margin-top: 8px;
}
</style>
