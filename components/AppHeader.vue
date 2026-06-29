<template>
  <header class="app-header">
    <div class="container header-inner">
      <!-- Logo -->
      <nuxt-link to="/" class="logo">
        <span class="logo-icon">🍔</span>
        <span class="logo-text">Anda<span class="logo-accent">Mart</span></span>
      </nuxt-link>

      <!-- Nav -->
      <nav class="nav-links">
        <!-- <nuxt-link to="/" class="nav-link" exact>Katalog</nuxt-link>
        <nuxt-link to="/?cat=makanan" class="nav-link">🍽 Makanan</nuxt-link>
        <nuxt-link to="/?cat=minuman" class="nav-link">🥤 Minuman</nuxt-link>
        <nuxt-link to="/?cat=cemilan" class="nav-link">🍿 Cemilan</nuxt-link> -->
        <nuxt-link to="/admin" class="nav-link nav-admin">⚙️ Admin</nuxt-link>
      </nav>

      <!-- Cart Button -->
      <button class="cart-btn" @click="toggleCart" id="cart-toggle-btn">
        <span class="cart-icon">🛒</span>
        <span class="cart-label">Keranjang</span>
        <span v-if="mounted && cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </button>

      <!-- Mobile menu toggle -->
      <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
        <span v-if="!mobileOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <!-- Mobile Nav -->
    <div v-if="mobileOpen" class="mobile-nav">
      <nuxt-link to="/" class="mobile-nav-link" @click.native="mobileOpen = false">🏠 Beranda</nuxt-link>
      <nuxt-link to="/?cat=makanan" class="mobile-nav-link" @click.native="mobileOpen = false">🍽 Makanan</nuxt-link>
      <nuxt-link to="/?cat=minuman" class="mobile-nav-link" @click.native="mobileOpen = false">🥤 Minuman</nuxt-link>
      <nuxt-link to="/?cat=cemilan" class="mobile-nav-link" @click.native="mobileOpen = false">🍿 Cemilan</nuxt-link>
      <nuxt-link to="/admin" class="mobile-nav-link" @click.native="mobileOpen = false">⚙️ Admin</nuxt-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      mobileOpen: false,
      mounted: false
    }
  },
  computed: {
    cartCount() {
      return this.$store.getters['cart/cartCount']
    }
  },
  mounted() {
    this.mounted = true
  },
  methods: {
    toggleCart() {
      this.$store.dispatch('cart/toggleCart')
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--header-height);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(229,231,235,0.6);
  z-index: 700;
  transition: box-shadow var(--transition);
}
.app-header:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
.header-inner {
  height: var(--header-height);
  display: flex;
  align-items: center;
  gap: 24px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon { font-size: 28px; }
.logo-text {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
}
.logo-accent { color: var(--primary); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.nav-link {
  padding: 7px 14px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition);
  white-space: nowrap;
}
.nav-link:hover, .nav-link.nuxt-link-exact-active {
  background: rgba(255,107,53,0.1);
  color: var(--primary);
}
.nav-admin {
  background: rgba(123,47,190,0.08);
  color: var(--accent-purple);
}
.nav-admin:hover {
  background: var(--accent-purple);
  color: white;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 14px;
  position: relative;
  transition: all var(--transition);
  flex-shrink: 0;
  box-shadow: var(--shadow-colored);
}
.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,107,53,0.4);
}
.cart-icon { font-size: 16px; }
.cart-badge {
  position: absolute;
  top: -6px; right: -6px;
  background: var(--secondary);
  color: var(--text-primary);
  border-radius: var(--radius-full);
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800;
  animation: pulse 1s ease infinite;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 6px;
  margin-left: auto;
  color: var(--text-primary);
}
.mobile-nav {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid var(--border-light);
  padding: 12px 16px;
}
.mobile-nav-link {
  display: block;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 15px;
  color: var(--text-secondary);
  transition: all var(--transition);
}
.mobile-nav-link:hover {
  background: rgba(255,107,53,0.08);
  color: var(--primary);
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .cart-label { display: none; }
  .mobile-menu-btn { display: block; }
  .mobile-nav { display: flex; }
  .cart-btn { padding: 9px 12px; }
}
</style>
