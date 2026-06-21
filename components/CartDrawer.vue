<template>
  <div>
    <!-- Overlay -->
    <div v-if="isOpen" class="drawer-overlay" @click="close"></div>

    <!-- Drawer -->
    <transition name="slide-right">
      <div v-if="isOpen" class="drawer" id="cart-drawer">
        <!-- Header -->
        <div class="drawer-header">
          <div class="drawer-title-wrap">
            <span class="drawer-title">🛒 Keranjang</span>
            <span v-if="cartCount > 0" class="drawer-count">{{ cartCount }} item</span>
          </div>
          <button class="close-btn" @click="close" id="cart-close-btn">✕</button>
        </div>

        <!-- Empty State -->
        <div v-if="cartItems.length === 0" class="cart-empty">
          <div class="empty-icon">🛒</div>
          <h3>Keranjang Kosong</h3>
          <p>Yuk mulai pilih makanan favoritmu!</p>
          <button class="btn btn-primary" @click="close" style="margin-top:16px">
            Lihat Produk
          </button>
        </div>

        <!-- Items -->
        <div v-else class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item"
          >
            <img :src="item.image" :alt="item.name" class="item-image" @error="onImgError" />
            <div class="item-info">
              <h4 class="item-name">{{ item.name }}</h4>
              <span class="item-price">{{ formatPrice(item.price) }}</span>
              <div class="item-actions">
                <div class="qty-control">
                  <button class="qty-btn" @click="decreaseQty(item)">−</button>
                  <span class="qty-value">{{ item.qty }}</span>
                  <button class="qty-btn" @click="increaseQty(item)">+</button>
                </div>
                <button class="remove-btn" @click="removeItem(item.id)" :id="`remove-cart-${item.id}`">🗑</button>
              </div>
            </div>
            <div class="item-subtotal">{{ formatPrice(item.price * item.qty) }}</div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cartItems.length > 0" class="drawer-footer">
          <div class="divider"></div>
          <div class="total-row">
            <span class="total-label">Total Belanja</span>
            <span class="total-value">{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="footer-actions">
            <button class="btn btn-outline btn-sm" @click="clearCart">Kosongkan</button>
            <nuxt-link to="/checkout" class="btn btn-primary checkout-btn" @click.native="close" id="go-checkout-btn">
              Checkout →
            </nuxt-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CartDrawer',
  computed: {
    isOpen() { return this.$store.getters['cart/isOpen'] },
    cartItems() { return this.$store.getters['cart/cartItems'] },
    cartCount() { return this.$store.getters['cart/cartCount'] },
    cartTotal() { return this.$store.getters['cart/cartTotal'] }
  },
  methods: {
    close() { this.$store.dispatch('cart/closeCart') },
    removeItem(id) { this.$store.dispatch('cart/removeFromCart', id) },
    increaseQty(item) {
      this.$store.dispatch('cart/updateQty', { productId: item.id, qty: item.qty + 1 })
    },
    decreaseQty(item) {
      this.$store.dispatch('cart/updateQty', { productId: item.id, qty: item.qty - 1 })
    },
    clearCart() {
      if (confirm('Kosongkan semua keranjang?')) {
        this.$store.dispatch('cart/clearCart')
      }
    },
    formatPrice(p) {
      return 'Rp ' + p.toLocaleString('id-ID')
    },
    onImgError(e) {
      e.target.src = 'https://via.placeholder.com/80x80/FF6B35/ffffff?text=F'
    }
  }
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 800;
  animation: fadeIn 0.2s ease;
}
.drawer {
  position: fixed;
  top: 0; right: 0;
  height: 100vh;
  width: 400px;
  max-width: 100vw;
  background: white;
  z-index: 900;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
}

/* Transition */
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
}
.slide-right-enter, .slide-right-leave-to {
  transform: translateX(100%);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 2px solid var(--border-light);
  background: linear-gradient(135deg, #fff8f3, #fff);
  flex-shrink: 0;
}
.drawer-title-wrap { display: flex; align-items: center; gap: 10px; }
.drawer-title {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 800;
}
.drawer-count {
  background: var(--primary);
  color: white;
  border-radius: var(--radius-full);
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
}
.close-btn {
  width: 36px; height: 36px;
  border-radius: var(--radius-full);
  background: var(--border-light);
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.close-btn:hover { background: var(--danger); color: white; }

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}
.empty-icon { font-size: 72px; margin-bottom: 16px; filter: grayscale(0.3); }
.cart-empty h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  font-family: var(--font-heading);
}
.cart-empty p { color: var(--text-secondary); }

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-light);
  transition: background var(--transition);
}
.cart-item:hover { background: #fafafa; }
.item-image {
  width: 72px; height: 72px;
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.item-info { flex: 1; min-width: 0; }
.item-name {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-price {
  font-size: 13px;
  color: var(--primary);
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}
.item-actions { display: flex; align-items: center; gap: 12px; }
.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.5;
  transition: opacity var(--transition);
  padding: 4px;
}
.remove-btn:hover { opacity: 1; }
.item-subtotal {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.drawer-footer {
  padding: 16px 24px 24px;
  flex-shrink: 0;
  background: white;
}
.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.total-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
}
.total-value {
  font-size: 22px;
  font-weight: 800;
  font-family: var(--font-heading);
  color: var(--primary);
}
.footer-actions {
  display: flex;
  gap: 12px;
}
.checkout-btn {
  flex: 1;
  justify-content: center;
  text-align: center;
}
</style>
