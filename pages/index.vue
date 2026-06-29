<template>
  <div>
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <div class="hero-text">
          <span class="hero-tag">🎉 Lebih dari 30 menu tersedia</span>
          <h1 class="hero-title">
            Pesan Makanan<br>
            <span class="gradient-text">Favoritmu</span> Sekarang!
          </h1>
          <p class="hero-desc">
            Dari makanan berat, minuman segar, hingga cemilan lezat — semua ada di AndaMart. Harga terjangkau, rasa tidak mengecewakan!
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" @click="scrollToProducts" id="hero-cta-btn">
              🍔 Lihat Menu
            </button>
            <button class="btn btn-outline btn-lg" @click="openCart">
              🛒 Keranjang ({{ cartCount }})
            </button>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-card">
            <span class="stat-num">30+</span>
            <span class="stat-label">Menu Pilihan</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">3</span>
            <span class="stat-label">Kategori</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">⭐ 4.8</span>
            <span class="stat-label">Rating</span>
          </div>
        </div>
      </div>
      <!-- Floating emoji decorations -->
      <div class="hero-deco deco-1">🍕</div>
      <div class="hero-deco deco-2">🥤</div>
      <div class="hero-deco deco-3">🍿</div>
      <div class="hero-deco deco-4">🧆</div>
    </section>

    <!-- ===== PRODUCTS ===== -->
    <section class="products-section container" id="products-section">
      <div class="section-header">
        <div>
          <h2 class="section-heading">Semua Menu</h2>
          <p class="section-sub">{{ filteredProducts.length }} produk ditemukan</p>
        </div>
      </div>

      <!-- Filter Bar -->
      <FilterBar
        :active-category="activeCategory"
        :active-sort="activeSort"
        @category-change="onCategoryChange"
        @sort-change="onSortChange"
      />

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Produk Tidak Ditemukan</h3>
        <p>Coba pilih kategori lain</p>
        <button class="btn btn-primary" style="margin-top:16px" @click="activeCategory = 'semua'">
          Lihat Semua
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      activeCategory: 'semua',
      activeSort: 'popular'
    }
  },
  computed: {
    filteredProducts() {
      return this.$store.getters['products/filteredProducts'](this.activeCategory, this.activeSort)
    },
    cartCount() {
      return this.$store.getters['cart/cartCount']
    }
  },
  mounted() {
    // Read category from URL query
    if (this.$route.query.cat) {
      this.activeCategory = this.$route.query.cat
    }
  },
  methods: {
    onCategoryChange(cat) {
      this.activeCategory = cat
      this.$router.replace({ query: cat !== 'semua' ? { cat } : {} }).catch(() => {})
    },
    onSortChange(sort) {
      this.activeSort = sort
    },
    scrollToProducts() {
      const el = document.getElementById('products-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    openCart() {
      this.$store.dispatch('cart/openCart')
    }
  },
  head() {
    return {
      title: 'AndaMart — Katalog Makanan, Minuman & Cemilan',
      meta: [
        { hid: 'description', name: 'description', content: 'Temukan 30+ menu makanan, minuman, dan cemilan terlezat di AndaMart.' }
      ]
    }
  }
}
</script>

<style scoped>
/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 560px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
  padding: 80px 0 60px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.25) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(123,47,190,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(6,214,160,0.15) 0%, transparent 50%);
  animation: gradientShift 8s ease infinite;
  background-size: 200% 200%;
}
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,107,53,0.15);
  border: 1px solid rgba(255,107,53,0.3);
  color: var(--primary-light);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);
}
.hero-title {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 900;
  color: white;
  line-height: 1.15;
  margin-bottom: 20px;
}
.hero-desc {
  font-size: 16px;
  color: rgba(255,255,255,0.65);
  max-width: 520px;
  line-height: 1.7;
  margin-bottom: 32px;
}
.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}
.btn-outline {
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.3);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-color: rgba(255,255,255,0.6);
  transform: translateY(-2px);
}
.hero-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.stat-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-lg);
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}
.stat-num {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 800;
  color: var(--primary-light);
}
.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

/* Floating decorations */
.hero-deco {
  position: absolute;
  font-size: 52px;
  opacity: 0.12;
  pointer-events: none;
  animation: float 4s ease-in-out infinite;
}
.deco-1 { top: 15%; right: 8%; animation-delay: 0s; }
.deco-2 { top: 60%; right: 18%; animation-delay: 1s; font-size: 40px; }
.deco-3 { bottom: 15%; right: 4%; animation-delay: 2s; font-size: 36px; }
.deco-4 { top: 30%; right: 30%; animation-delay: 0.5s; font-size: 44px; }

/* ===== PRODUCTS ===== */
.products-section {
  padding: 60px 24px;
}
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

@media (max-width: 768px) {
  .hero { min-height: auto; padding: 60px 0 40px; }
  .hero-stats { gap: 10px; }
  .stat-card { padding: 12px 16px; }
  .hero-deco { display: none; }
}
</style>
