<template>
  <div class="product-card card" :class="{ 'card--bestseller': product.isBestseller }">
    <!-- Badges -->
    <div class="card-badges">
      <span v-if="product.isBestseller" class="badge badge-hot">🔥 Best Seller</span>
      <span v-else-if="product.isNew" class="badge badge-new">✨ Terbaru</span>
    </div>

    <!-- Image -->
    <nuxt-link :to="`/product/${product.id}`" class="card-image-wrap">
      <img
        :src="product.image"
        :alt="product.name"
        class="card-image"
        loading="lazy"
        @error="onImgError"
      />
      <div class="card-overlay">
        <span class="view-detail">Lihat Detail →</span>
      </div>
    </nuxt-link>

    <!-- Body -->
    <div class="card-body">
      <!-- Category Tag -->
      <span class="category-tag">
        {{ categoryIcon }} {{ categoryLabel }}
      </span>

      <!-- Name -->
      <nuxt-link :to="`/product/${product.id}`">
        <h3 class="card-name">{{ product.name }}</h3>
      </nuxt-link>

      <!-- Rating & Sold -->
      <div class="card-meta">
        <span class="stars">{{ stars }}</span>
        <span class="meta-text">{{ product.rating }}</span>
        <span class="meta-sep">·</span>
        <span class="meta-text">{{ formatSold(product.sold) }} terjual</span>
      </div>

      <!-- Price + Add Button -->
      <div class="card-footer">
        <span class="price price-sm">{{ formatPrice(product.price) }}</span>
        <button
          class="add-btn"
          :class="{ 'add-btn--added': isInCart }"
          @click.prevent="addToCart"
          :id="`add-cart-${product.id}`"
        >
          <span v-if="!isInCart">+ Keranjang</span>
          <span v-else>✓ Di Keranjang</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: { type: Object, required: true }
  },
  computed: {
    isInCart() {
      return this.$store.getters['cart/isInCart'](this.product.id)
    },
    stars() {
      const full = Math.floor(this.product.rating)
      return '★'.repeat(full) + (this.product.rating % 1 >= 0.5 ? '½' : '')
    },
    categoryIcon() {
      const map = { makanan: '🍽', minuman: '🥤', cemilan: '🍿' }
      return map[this.product.category] || '🍴'
    },
    categoryLabel() {
      const map = { makanan: 'Makanan', minuman: 'Minuman', cemilan: 'Cemilan' }
      return map[this.product.category] || this.product.category
    }
  },
  methods: {
    addToCart() {
      this.$store.dispatch('cart/addToCart', this.product)
      this.$store.dispatch('showToast', {
        message: `${this.product.name} ditambahkan ke keranjang! 🛒`,
        type: 'success'
      })
    },
    formatPrice(p) {
      return 'Rp ' + p.toLocaleString('id-ID')
    },
    formatSold(s) {
      return s >= 1000 ? (s / 1000).toFixed(1) + 'rb' : s
    },
    onImgError(e) {
      e.target.src = 'https://picsum.photos/600/450'
    }
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: white;
  transition: transform var(--transition), box-shadow var(--transition);
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
.card--bestseller {
  border: 2px solid rgba(255,107,53,0.2);
}

.card-badges {
  position: absolute;
  top: 12px; left: 12px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-image-wrap {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #f3f4f6;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.product-card:hover .card-image {
  transform: scale(1.08);
}
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26,26,46,0.7) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 16px;
  opacity: 0;
  transition: opacity var(--transition);
}
.product-card:hover .card-overlay {
  opacity: 1;
}
.view-detail {
  color: white;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.category-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-light);
}

.card-name {
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition);
}
.card-name:hover { color: var(--primary); }

.card-meta {
  display: flex;
  align-items: center;
  gap: 4px;
}
.stars { font-size: 12px; color: var(--secondary); }
.meta-text { font-size: 12px; color: var(--text-secondary); }
.meta-sep { color: var(--text-light); font-size: 12px; }

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.add-btn {
  padding: 7px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  transition: all var(--transition);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(255,107,53,0.25);
}
.add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(255,107,53,0.4);
}
.add-btn--added {
  background: linear-gradient(135deg, var(--accent-green), #00b386);
  box-shadow: 0 2px 8px rgba(6,214,160,0.3);
}
</style>
