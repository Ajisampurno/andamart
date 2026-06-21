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
            <label for="co-notes">Catatan Tambahan (opsional)</label>
            <input id="co-notes" v-model="form.notes" class="form-control" placeholder="Tanpa pedas, extra saus, dll" />
          </div>

          <div class="form-group">
            <label for="delivery-date">Tanggal Pengiriman</label>
            <input id="delivery-date" type="date" v-model="form.deliveryDate" @change="onDeliveryDateChange" class="form-control" />
          </div>

          <div class="form-group">
            <label>Dikirim jam berapa?</label>
            <div class="time-options">
              <label class="time-option" :class="{ disabled: isDisabled0730 }">
                <input type="radio" v-model="form.deliveryTime" value="07:30" :disabled="isDisabled0730" />
                <span>07:30</span>
              </label>

              <label class="time-option" :class="{ disabled: isDisabled1200 }">
                <input type="radio" v-model="form.deliveryTime" value="12:00" :disabled="isDisabled1200" />
                <span>12:00</span>
              </label>
            </div>
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
          <div class="payment-detail-wrap">
            <transition name="fade">
              <div v-if="form.payment !== 'cod'" class="payment-detail">
                <div v-if="form.payment === 'transfer'" class="payment-transfer">
                  <div class="bank-name">{{ transferAccount.bank }}</div>
                  <div class="bank-number">No. Rek: <strong>{{ transferAccount.number }}</strong></div>
                  <div class="bank-owner">a.n. {{ transferAccount.name }}</div>
                </div>

                <div v-else-if="form.payment === 'ewallet'" class="payment-ewallet">
                  <div>Nomor E-Wallet: <strong>{{ ewalletNumber }}</strong></div>
                  <div class="muted">Gunakan nomor di atas untuk transfer GoPay / OVO</div>
                </div>

                <div v-else-if="form.payment === 'qris'" class="payment-qris">
                  <img :src="qrisImage" alt="QRIS" class="qris-img" @error="onImgError" @click="openQris" />
                  <div class="muted">Scan QR untuk melakukan pembayaran via mobile banking / e-wallet — klik gambar untuk memperbesar</div>
                </div>
              </div>

              <div v-else class="payment-rules">
                <p>Untuk Bayar di Tempat (COD): siapkan uang pas. Driver dapat meminta identitas atau konfirmasi ulang. Pesanan dapat dibatalkan jika tidak ada penerima.</p>
              </div>
            </transition>
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
          <p v-if="!isFormValid" class="form-hint">* Lengkapi jam Pengiriman</p>
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

    <!-- QRIS Modal -->
    <div v-if="showQris" class="modal-overlay" @click.self="closeQris">
      <div class="modal-box qris-modal">
        <button class="btn btn-ghost close-btn" @click="closeQris">✕</button>
        <img :src="qrisImage" alt="QRIS Large" class="qris-large" @error="onImgError" />
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
        notes: '',
        payment: 'transfer',
        deliveryTime: '',
        deliveryDate: ''
      },
      paymentOptions: [
        { value: 'transfer', icon: '🏦', label: 'Transfer Bank' },
        { value: 'ewallet', icon: '📱', label: 'E-Wallet (GoPay/OVO)' },
        { value: 'cod', icon: '💵', label: 'Bayar di Tempat (COD)' },
        { value: 'qris', icon: '📷', label: 'QRIS' }
      ],
      // payment details
      transferAccount: {
        bank: 'BCA',
        number: '123-456-7890',
        name: 'PT FoodieHub'
      },
      ewalletNumber: '0812-3456-7890',
      qrisImage: '/uploads/qris.jpeg',
      submitted: false,
      showSuccess: false,
      showQris: false,
      orderId: ''
      ,
      currentMinutes: null
    }
  },
  computed: {
    cartItems() { return this.$store.getters['cart/cartItems'] },
    cartTotal() { return this.$store.getters['cart/cartTotal'] },
    isFormValid() {
      return this.form.deliveryDate && this.form.deliveryTime
    }
    ,
    isTodaySelected() {
      if (!this.form.deliveryDate) return true
      return this.form.deliveryDate === this.getTodayDate()
    },
    isDisabled0730() {
      if (!this.isTodaySelected) return false
      if (this.currentMinutes === null) return false
      return this.currentMinutes > (7 * 60)
    },
    isDisabled1200() {
      if (!this.isTodaySelected) return false
      if (this.currentMinutes === null) return false
      return this.currentMinutes > (12 * 60)
    }
  },
  methods: {
    formatPrice(p) { return 'Rp ' + p.toLocaleString('id-ID') },
    onImgError(e) {
      e.target.src = 'https://picsum.photos/600/450'
    },
    openQris() {
      this.showQris = true
    },
    closeQris() {
      this.showQris = false
    },
    submitOrder() {
      if (!this.isFormValid) return
      this.submitted = true
      this.orderId = Math.random().toString(36).substr(2, 8).toUpperCase()
      this.sendOrderToWhatsapp()
      setTimeout(() => {
        this.showSuccess = true
      }, 800)
    },
    sendOrderToWhatsapp() {
      const number = '6283117764077'
      const payments = this.paymentOptions
        .find(opt => opt.value === this.form.payment)
      const paymentLabel = payments ? payments.label : this.form.payment
      const itemsText = this.cartItems.map(item => {
        const price = (item.price * item.qty).toLocaleString('id-ID')
        return `- ${item.name} x${item.qty}: Rp ${price}`
      }).join('\n')

      const text = [
        `Halo, saya ingin konfirmasi pesanan berikut:`,
        ``,
        `Order ID: ${this.orderId}`,
        `Tanggal Kirim: ${this.form.deliveryDate}`,
        `Waktu Kirim: ${this.form.deliveryTime}`,
        `Metode Pembayaran: ${paymentLabel}`,
        `Catatan: ${this.form.notes || '-'}`,
        `Rincian Pesanan:`,
        itemsText,
        `Subtotal: Rp ${this.cartTotal.toLocaleString('id-ID')}`
      ].join('\n')

      const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
    },
    goHome() {
      this.$store.dispatch('cart/clearCart')
      this.showSuccess = false
      this.$router.push('/')
    }
    ,
    setCurrentMinutes() {
      const d = new Date()
      this.currentMinutes = d.getHours() * 60 + d.getMinutes()
    },
    getTodayDate() {
      const d = new Date()
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },
    onDeliveryDateChange() {
      // if selected date changes, clear deliveryTime if it becomes disabled
      if (this.form.deliveryTime === '07:30' && this.isDisabled0730) this.form.deliveryTime = ''
      if (this.form.deliveryTime === '12:00' && this.isDisabled1200) this.form.deliveryTime = ''
    }
  },
  mounted() {
    this.setCurrentMinutes()
    // default delivery date to today
    this.form.deliveryDate = this.getTodayDate()
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

.time-options { display: flex; gap: 12px; margin-top: 8px; }
.time-option {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
}
.time-option input { margin-right: 6px; }
.time-option.disabled { opacity: 0.5; cursor: not-allowed; }

.payment-detail-wrap { margin-top: 12px; }
.payment-detail { padding: 12px; border: 1px dashed var(--border); border-radius: var(--radius-sm); background: var(--bg-main); }
.qris-img { max-width: 160px; height: auto; display: block; margin-bottom: 8px; }
.bank-name { font-weight: 800; margin-bottom: 6px; }
.bank-number { margin-bottom: 4px; }
.bank-owner { color: var(--text-secondary); font-size: 13px; }
.muted { color: var(--text-secondary); font-size: 13px; }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter, .fade-leave-to { opacity: 0; }

/* QRIS Modal */
.qris-modal { text-align: center; max-width: 520px; position: relative; padding: 20px; }
.qris-large { max-width: 100%; height: auto; border-radius: 8px; box-shadow: var(--shadow-lg); }
.close-btn { position: absolute; top: 10px; right: 10px; border: none; background: transparent; font-size: 18px; cursor: pointer; }
.qris-img { cursor: pointer; }

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
