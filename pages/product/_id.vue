<template>
  <div class="container" style="padding-top:40px; padding-bottom:60px">
    <!-- Back -->
    <button class="back-btn" @click="$router.back()" id="back-btn">
      ← Kembali
    </button>

    <div v-if="product">
      <div class="detail-grid">
        <!-- Image -->
        <div class="detail-image-wrap">
          <img :src="product.image" :alt="product.name" class="detail-image" @error="onImgError" />
          <div class="detail-badges">
            <span v-if="product.isBestseller" class="badge badge-hot">🔥 Best Seller</span>
            <span v-if="product.isNew" class="badge badge-new">✨ Terbaru</span>
          </div>
        </div>

        <!-- Info -->
        <div class="detail-info">
          <span class="detail-category">
            {{ categoryIcon }} {{ categoryLabel }}
          </span>
          <h1 class="detail-name">{{ product.name }}</h1>

          <!-- Rating -->
          <div class="detail-rating">
            <span class="stars" style="font-size:18px">{{ stars }}</span>
            <span class="rating-num">{{ product.rating }}</span>
            <span class="rating-sep">·</span>
            <span class="rating-sold">{{ product.sold.toLocaleString('id-ID') }} terjual</span>
            <span class="rating-sep">·</span>
            <span class="rating-stock" :class="product.stock > 10 ? 'in-stock' : 'low-stock'">
              {{ product.stock > 0 ? `Stok: ${product.stock}` : 'Habis' }}
            </span>
          </div>

          <!-- Price -->
          <div class="detail-price">{{ formatPrice(product.price) }}</div>

          <!-- Description -->
          <div class="detail-desc-wrap">
            <h3 class="desc-title">Deskripsi</h3>
            <p class="detail-desc">{{ product.description }}</p>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="detail-actions">
            <div class="qty-control" style="border-radius:12px; border-width:2px;">
              <button class="qty-btn" @click="qty > 1 && qty--">−</button>
              <span class="qty-value" style="min-width:48px; font-size:17px">{{ qty }}</span>
              <button class="qty-btn" @click="qty < product.stock && qty++">+</button>
            </div>
            <button
              class="btn btn-primary add-detail-btn"
              :disabled="product.stock === 0"
              @click="addToCart"
              id="add-to-cart-detail"
            >
              🛒 Tambah ke Keranjang
            </button>
          </div>

          <div class="detail-subtotal" v-if="qty > 1">
            Total: <strong>{{ formatPrice(product.price * qty) }}</strong>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="related.length > 0" class="related-section">
        <h2 class="section-heading" style="margin-bottom:24px">Menu Lainnya</h2>
        <div class="products-grid">
          <ProductCard v-for="p in related" :key="p.id" :product="p" />
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="empty-state">
      <div class="empty-state-icon">😕</div>
      <h3>Produk Tidak Ditemukan</h3>
      <nuxt-link to="/" class="btn btn-primary" style="margin-top:16px">Kembali ke Katalog</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return { qty: 1 }
  },
  computed: {
    product() {
      return this.$store.getters['products/productById'](this.$route.params.id)
    },
    related() {
      if (!this.product) return []
      return this.$store.getters['products/relatedProducts'](this.product.category, this.product.id)
    },
    stars() {
      const full = Math.floor(this.product.rating)
      return '★'.repeat(full) + (this.product.rating % 1 >= 0.5 ? '½' : '')
    },
    categoryIcon() {
      const map = { makanan: '🍽', minuman: '🥤', cemilan: '🍿' }
      return this.product ? map[this.product.category] : ''
    },
    categoryLabel() {
      const map = { makanan: 'Makanan', minuman: 'Minuman', cemilan: 'Cemilan' }
      return this.product ? map[this.product.category] : ''
    }
  },
  methods: {
    addToCart() {
      this.$store.dispatch('cart/addToCart', { ...this.product, qty: this.qty })
      this.$store.dispatch('showToast', {
        message: `${this.product.name} (x${this.qty}) ditambahkan ke keranjang! 🛒`,
        type: 'success'
      })
      this.$store.dispatch('cart/openCart')
    },
    formatPrice(p) {
      return 'Rp ' + p.toLocaleString('id-ID')
    },
    onImgError(e) {
      e.target.src = 'https://picsum.photos/600/450'
    }
  },
  head() {
    return {
      title: this.product ? `${this.product.name} — Andamart` : 'Produk — Andamart'
    }
  }
}
</script>

<style scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 2px solid var(--border);
  border-radius: var(--radius-full);
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 32px;
  transition: all var(--transition);
}
.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  margin-bottom: 64px;
}
.detail-image-wrap {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  aspect-ratio: 4/3;
  background: #f3f4f6;
}
.detail-image {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.detail-image-wrap:hover .detail-image { transform: scale(1.04); }
.detail-badges {
  position: absolute;
  top: 16px; left: 16px;
  display: flex; flex-direction: column; gap: 8px;
}
.detail-category {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--primary);
  background: rgba(255,107,53,0.1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  margin-bottom: 12px;
}
.detail-name {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 900;
  font-family: var(--font-heading);
  line-height: 1.2;
  margin-bottom: 16px;
}
.detail-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.rating-num { font-weight: 700; }
.rating-sep { color: var(--text-light); }
.rating-sold { color: var(--text-secondary); font-size: 14px; }
.in-stock { color: var(--accent-green); font-weight: 700; }
.low-stock { color: var(--danger); font-weight: 700; }

.detail-price {
  font-size: 36px;
  font-weight: 900;
  font-family: var(--font-heading);
  color: var(--primary);
  margin-bottom: 24px;
}
.detail-desc-wrap { margin-bottom: 28px; }
.desc-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-light);
  margin-bottom: 10px;
}
.detail-desc {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 15px;
}
.detail-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.add-detail-btn {
  flex: 1;
  min-width: 180px;
  padding: 14px 24px;
  font-size: 15px;
  justify-content: center;
}
.add-detail-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.detail-subtotal {
  margin-top: 12px;
  font-size: 15px;
  color: var(--text-secondary);
}
.detail-subtotal strong { color: var(--primary); font-size: 18px; }

.related-section { margin-top: 48px; }

@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; gap: 28px; }
  .detail-name { font-size: 24px; }
  .detail-price { font-size: 28px; }
  .add-detail-btn { min-width: unset; }
}
</style>
