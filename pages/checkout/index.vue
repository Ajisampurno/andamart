<template>
  <div class="container checkout-page">
    <h1 class="section-heading" style="margin-bottom:8px">💳 Checkout</h1>
    <p class="section-sub">Periksa pesanan dan isi data pengiriman</p>

    <div v-if="cartItems.length === 0" class="empty-state">
      <div class="empty-state-icon">🛒</div>
      <h3>Keranjang Kosong</h3>
      <p>Tambahkan produk ke keranjang terlebih dahulu</p>
      <nuxt-link to="/" class="btn btn-primary" style="margin-top:16px">Lihat Katalog</nuxt-link>
    </div>

    <div v-else class="checkout-grid">
      <!-- Form -->
      <div class="checkout-form-wrap">
        <div class="checkout-card">
          <h2 class="checkout-card-title">📋 Data Pemesan</h2>
          <div class="form-group">
            <label for="co-name">Nama Lengkap</label>
            <input id="co-name" v-model="form.name" class="form-control" placeholder="Contoh: Budi Santoso" />
          </div>
          <div class="form-group">
            <label for="co-phone">Nomor HP / WhatsApp</label>
            <input id="co-phone" v-model="form.phone" class="form-control" placeholder="08xxxxxxxxxx" type="tel" />
          </div>
          <div class="form-group">
            <label for="co-address">Alamat Pengiriman</label>
            <textarea id="co-address" v-model="form.address" class="form-control" placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="co-notes">Catatan Tambahan (opsional)</label>
            <input id="co-notes" v-model="form.notes" class="form-control" placeholder="Tanpa pedas, extra saus, dll" />
          </div>
        </div>

        <div class="checkout-card">
          <h2 class="checkout-card-title">💵 Metode Pembayaran</h2>
          <div class="payment-options">
            <label
              v-for="opt in paymentOptions"
              :key="opt.value"
              class="payment-option"
              :class="{ active: form.payment === opt.value }"
            >
              <input type="radio" v-model="form.payment" :value="opt.value" hidden />
              <span class="payment-icon">{{ opt.icon }}</span>
              <span class="payment-label">{{ opt.label }}</span>
              <span v-if="form.payment === opt.value" class="payment-check">✓</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <div class="checkout-card sticky-card">
          <h2 class="checkout-card-title">🧾 Ringkasan Pesanan</h2>

          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <img :src="item.image" :alt="item.name" class="summary-img" @error="onImgError" />
              <div class="summary-item-info">
                <span class="summary-name">{{ item.name }}</span>
                <span class="summary-qty">x{{ item.qty }}</span>
              </div>
              <span class="summary-price">{{ formatPrice(item.price * item.qty) }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Ongkos Kirim</span>
            <span class="text-green">Gratis 🎉</span>
          </div>
          <div class="summary-row total-final">
            <span>Total Pembayaran</span>
            <span class="total-big">{{ formatPrice(cartTotal) }}</span>
          </div>

          <button
            class="btn btn-primary"
            style="width:100%; justify-content:center; padding:16px; font-size:16px; margin-top:16px;"
            @click="submitOrder"
            :disabled="!isFormValid || submitted"
            id="submit-order-btn"
          >
            {{ submitted ? '✅ Pesanan Dikirim!' : '🚀 Konfirmasi Pesanan' }}
          </button>
          <p v-if="!isFormValid" class="form-hint">* Lengkapi nama, HP, dan alamat terlebih dahulu</p>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="modal-overlay" @click.self="goHome">
      <div class="modal-box success-modal">
        <div class="success-icon">🎉</div>
        <h2 class="success-title">Pesanan Berhasil!</h2>
        <p class="success-desc">Terima kasih, <strong>{{ form.name }}</strong>! Pesananmu sedang diproses. Kami akan menghubungi kamu di <strong>{{ form.phone }}</strong>.</p>
        <div class="success-order-id">
          #ORDER-{{ orderId }}
        </div>
        <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:20px;" @click="goHome" id="go-home-after-order">
          🏠 Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutPage',
  data() {
    return {
      form: {
        name: '',
        phone: '',
        address: '',
        notes: '',
        payment: 'transfer'
      },
      paymentOptions: [
        { value: 'transfer', icon: '🏦', label: 'Transfer Bank' },
        { value: 'ewallet', icon: '📱', label: 'E-Wallet (GoPay/OVO)' },
        { value: 'cod', icon: '💵', label: 'Bayar di Tempat (COD)' },
        { value: 'qris', icon: '📷', label: 'QRIS' }
      ],
      submitted: false,
      showSuccess: false,
      orderId: ''
    }
  },
  computed: {
    cartItems() { return this.$store.getters['cart/cartItems'] },
    cartTotal() { return this.$store.getters['cart/cartTotal'] },
    isFormValid() {
      return this.form.name.trim() && this.form.phone.trim() && this.form.address.trim()
    }
  },
  methods: {
    formatPrice(p) { return 'Rp ' + p.toLocaleString('id-ID') },
    onImgError(e) {
      e.target.src = 'https://picsum.photos/600/450'
    },
    submitOrder() {
      if (!this.isFormValid) return
      this.submitted = true
      this.orderId = Math.random().toString(36).substr(2, 8).toUpperCase()
      setTimeout(() => {
        this.showSuccess = true
      }, 800)
    },
    goHome() {
      this.$store.dispatch('cart/clearCart')
      this.showSuccess = false
      this.$router.push('/')
    }
  },
  head() {
    return { title: 'Checkout — FoodieHub' }
  }
}
</script>

<style scoped>
.checkout-page { padding-top: 40px; padding-bottom: 80px; }
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 32px;
  align-items: start;
  margin-top: 36px;
}
.checkout-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 28px;
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
}
.checkout-card-title {
  font-size: 17px;
  font-weight: 800;
  font-family: var(--font-heading);
  margin-bottom: 20px;
}
textarea.form-control { resize: vertical; }

.payment-options { display: flex; flex-direction: column; gap: 10px; }
.payment-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}
.payment-option:hover { border-color: var(--primary); }
.payment-option.active {
  border-color: var(--primary);
  background: rgba(255,107,53,0.06);
}
.payment-icon { font-size: 22px; }
.payment-label { flex: 1; font-weight: 600; }
.payment-check {
  width: 22px; height: 22px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800;
}

.sticky-card { position: sticky; top: calc(var(--header-height) + 24px); }
.summary-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.summary-item {
  display: flex; align-items: center; gap: 12px;
}
.summary-img {
  width: 52px; height: 52px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.summary-item-info {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
}
.summary-name {
  font-size: 13px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.summary-qty { font-size: 12px; color: var(--text-secondary); }
.summary-price { font-size: 13px; font-weight: 700; white-space: nowrap; }

.summary-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: var(--text-secondary);
}
.text-green { color: var(--accent-green); font-weight: 700; }
.total-final {
  font-size: 15px; font-weight: 700;
  color: var(--text-primary);
  border-top: 2px solid var(--border-light);
  padding-top: 12px; margin-top: 6px;
}
.total-big {
  font-size: 22px; font-weight: 900;
  color: var(--primary);
  font-family: var(--font-heading);
}
.form-hint { font-size: 12px; color: var(--text-light); text-align: center; margin-top: 8px; }

/* Success Modal */
.success-modal { text-align: center; max-width: 440px; }
.success-icon { font-size: 72px; margin-bottom: 16px; animation: bounce 1s ease infinite; }
.success-title {
  font-size: 28px; font-weight: 900;
  font-family: var(--font-heading); margin-bottom: 12px;
}
.success-desc { color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px; }
.success-order-id {
  background: var(--bg-main);
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  padding: 12px;
  font-family: monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 2px;
}

@media (max-width: 900px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .sticky-card { position: static; }
}
</style>
