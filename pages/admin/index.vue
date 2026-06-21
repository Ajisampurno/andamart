<template>
  <div class="admin-page container">
    <!-- Header -->
    <div class="admin-header">
      <div>
        <h1 class="section-heading">⚙️ Admin Panel</h1>
        <p class="section-sub">Kelola semua produk katalog</p>
      </div>
      <button class="btn btn-primary" @click="openAddModal" id="btn-add-product">
        + Tambah Produk
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="admin-stats">
      <div class="admin-stat" v-for="stat in stats" :key="stat.label">
        <span class="admin-stat-icon">{{ stat.icon }}</span>
        <div>
          <span class="admin-stat-num">{{ stat.value }}</span>
          <span class="admin-stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Search + Filter -->
    <div class="admin-toolbar">
      <input
        v-model="search"
        class="form-control search-input"
        placeholder="🔍 Cari produk..."
        id="admin-search"
      />
      <select v-model="filterCat" class="form-control" style="width:160px; margin-bottom:0" id="admin-filter-cat">
        <option value="">Semua Kategori</option>
        <option value="makanan">🍽 Makanan</option>
        <option value="minuman">🥤 Minuman</option>
        <option value="cemilan">🍿 Cemilan</option>
      </select>
    </div>

    <!-- Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Terjual</th>
            <th>Badge</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="displayedProducts.length === 0">
            <td colspan="7" class="table-empty">Tidak ada produk ditemukan</td>
          </tr>
          <tr v-for="product in displayedProducts" :key="product.id" class="table-row">
            <td class="product-cell">
              <img :src="product.image" :alt="product.name" class="table-thumb" @error="onImgError" />
              <div>
                <div class="table-product-name">{{ product.name }}</div>
                <div class="table-product-id">#{{ product.id }}</div>
              </div>
            </td>
            <td>
              <span class="cat-chip" :class="`cat-${product.category}`">
                {{ catIcon(product.category) }} {{ catLabel(product.category) }}
              </span>
            </td>
            <td class="price price-sm">{{ formatPrice(product.price) }}</td>
            <td>
              <span :class="product.stock <= 10 ? 'low-stock-badge' : 'normal-stock-badge'">
                {{ product.stock }}
              </span>
            </td>
            <td class="sold-cell">{{ product.sold.toLocaleString('id-ID') }}</td>
            <td>
              <div class="badge-cells">
                <span v-if="product.isBestseller" class="badge badge-hot" style="font-size:10px">🔥 BS</span>
                <span v-if="product.isNew" class="badge badge-new" style="font-size:10px">✨ New</span>
                <span v-if="!product.isBestseller && !product.isNew" class="no-badge">—</span>
              </div>
            </td>
            <td>
              <div class="action-btns">
                <button class="btn btn-ghost btn-sm" @click="openEditModal(product)" :id="`edit-btn-${product.id}`">✏️</button>
                <button class="btn btn-sm delete-btn" @click="confirmDelete(product)" :id="`delete-btn-${product.id}`">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ===== ADD / EDIT MODAL ===== -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <span class="modal-title">{{ isEdit ? '✏️ Edit Produk' : '➕ Tambah Produk' }}</span>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveProduct">
          <div class="form-row">
            <div class="form-group">
              <label>Nama Produk *</label>
              <input v-model="form.name" class="form-control" placeholder="Nama produk" required />
            </div>
            <div class="form-group">
              <label>Kategori *</label>
              <select v-model="form.category" class="form-control" required>
                <option value="">Pilih Kategori</option>
                <option value="makanan">🍽 Makanan</option>
                <option value="minuman">🥤 Minuman</option>
                <option value="cemilan">🍿 Cemilan</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Harga (Rp) *</label>
              <input v-model.number="form.price" class="form-control" type="number" min="0" placeholder="25000" required />
            </div>
            <div class="form-group">
              <label>Stok *</label>
              <input v-model.number="form.stock" class="form-control" type="number" min="0" placeholder="50" required />
            </div>
          </div>

          <div class="form-group">
            <label>Gambar (URL atau Upload File)</label>
            <input v-model="form.image" class="form-control" placeholder="https://..." style="margin-bottom: 8px;" />
            <input type="file" accept="image/*" @change="handleFileUpload" class="form-control" style="padding: 10px;" />
          </div>
          <div v-if="form.image" class="img-preview-wrap">
            <img :src="form.image" class="img-preview" @error="onImgError" />
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="form.description" class="form-control" rows="3" placeholder="Deskripsi produk..."></textarea>
          </div>

          <div class="form-checkboxes">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.isBestseller" />
              <span>🔥 Best Seller</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.isNew" />
              <span>✨ Produk Terbaru</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary" id="save-product-btn">
              {{ isEdit ? '💾 Simpan Perubahan' : '➕ Tambah Produk' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===== DELETE CONFIRM MODAL ===== -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-box" style="max-width:400px; text-align:center;">
        <div style="font-size:56px; margin-bottom:16px;">🗑️</div>
        <h3 class="modal-title" style="margin-bottom:12px;">Hapus Produk?</h3>
        <p style="color:var(--text-secondary); margin-bottom:24px;">
          Yakin ingin menghapus <strong>{{ deleteTarget && deleteTarget.name }}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div style="display:flex; gap:12px; justify-content:center;">
          <button class="btn btn-outline" @click="showDeleteModal = false">Batal</button>
          <button class="btn btn-danger" @click="deleteProduct" id="confirm-delete-btn">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const emptyForm = () => ({
  name: '', category: '', price: '', stock: '', image: '', description: '', isBestseller: false, isNew: false
})

export default {
  name: 'AdminPage',
  data() {
    return {
      search: '',
      filterCat: '',
      showModal: false,
      showDeleteModal: false,
      isEdit: false,
      form: emptyForm(),
      editId: null,
      deleteTarget: null
    }
  },
  computed: {
    allProducts() {
      return this.$store.getters['products/allProducts']
    },
    displayedProducts() {
      let list = [...this.allProducts]
      if (this.filterCat) list = list.filter(p => p.category === this.filterCat)
      if (this.search) {
        const q = this.search.toLowerCase()
        list = list.filter(p => p.name.toLowerCase().includes(q))
      }
      return list
    },
    stats() {
      const all = this.allProducts
      return [
        { icon: '📦', value: all.length, label: 'Total Produk' },
        { icon: '🍽', value: all.filter(p => p.category === 'makanan').length, label: 'Makanan' },
        { icon: '🥤', value: all.filter(p => p.category === 'minuman').length, label: 'Minuman' },
        { icon: '🍿', value: all.filter(p => p.category === 'cemilan').length, label: 'Cemilan' },
        { icon: '🔥', value: all.filter(p => p.isBestseller).length, label: 'Best Seller' }
      ]
    }
  },
  methods: {
    catIcon(cat) { return { makanan: '🍽', minuman: '🥤', cemilan: '🍿' }[cat] || '🍴' },
    catLabel(cat) { return { makanan: 'Makanan', minuman: 'Minuman', cemilan: 'Cemilan' }[cat] || cat },
    formatPrice(p) { return 'Rp ' + p.toLocaleString('id-ID') },
    onImgError(e) { e.target.src = 'https://picsum.photos/600/450' },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    openAddModal() {
      this.isEdit = false
      this.form = emptyForm()
      this.showModal = true
    },
    openEditModal(product) {
      this.isEdit = true
      this.editId = product.id
      this.form = { ...product }
      this.showModal = true
    },
    closeModal() { this.showModal = false },

    saveProduct() {
      if (!this.form.name || !this.form.category || !this.form.price || !this.form.stock) return
      if (this.isEdit) {
        this.$store.dispatch('products/updateProduct', { ...this.form, id: this.editId })
        this.$store.dispatch('showToast', { message: 'Produk berhasil diperbarui! ✏️', type: 'success' })
      } else {
        this.$store.dispatch('products/addProduct', this.form)
        this.$store.dispatch('showToast', { message: 'Produk berhasil ditambahkan! 🎉', type: 'success' })
      }
      this.closeModal()
    },

    confirmDelete(product) {
      this.deleteTarget = product
      this.showDeleteModal = true
    },
    deleteProduct() {
      this.$store.dispatch('products/deleteProduct', this.deleteTarget.id)
      this.$store.dispatch('showToast', { message: `${this.deleteTarget.name} dihapus.`, type: 'error' })
      this.showDeleteModal = false
      this.deleteTarget = null
    }
  },
  head() {
    return { title: 'Admin Panel — FoodieHub' }
  }
}
</script>

<style scoped>
.admin-page { padding-top: 40px; padding-bottom: 80px; }
.admin-header {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
}

.admin-stats {
  display: flex; gap: 16px; flex-wrap: wrap;
  margin-bottom: 28px;
}
.admin-stat {
  display: flex; align-items: center; gap: 14px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 16px 22px;
  box-shadow: var(--shadow-sm);
  flex: 1; min-width: 120px;
}
.admin-stat-icon { font-size: 28px; }
.admin-stat-num {
  display: block; font-size: 22px; font-weight: 800;
  font-family: var(--font-heading); color: var(--primary);
}
.admin-stat-label { font-size: 12px; color: var(--text-secondary); }

.admin-toolbar {
  display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
}
.search-input { flex: 1; min-width: 200px; margin-bottom: 0; }

.admin-table-wrap {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  overflow-x: auto;
}
.admin-table { width: 100%; border-collapse: collapse; min-width: 680px; }
.admin-table th {
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-darker));
  color: rgba(255,255,255,0.8);
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
}
.table-row td { padding: 14px 16px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }
.table-row:last-child td { border-bottom: none; }
.table-row:hover td { background: #fafafa; }

.product-cell { display: flex; align-items: center; gap: 12px; }
.table-thumb {
  width: 52px; height: 52px; object-fit: cover;
  border-radius: var(--radius-sm); flex-shrink: 0;
}
.table-product-name { font-weight: 700; font-size: 14px; }
.table-product-id { font-size: 11px; color: var(--text-light); }

.cat-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: var(--radius-full);
  font-size: 12px; font-weight: 700;
}
.cat-makanan { background: rgba(255,107,53,0.1); color: var(--primary); }
.cat-minuman { background: rgba(67,97,238,0.1); color: var(--accent-blue); }
.cat-cemilan { background: rgba(123,47,190,0.1); color: var(--accent-purple); }

.low-stock-badge {
  background: rgba(239,35,60,0.1); color: var(--danger);
  padding: 3px 10px; border-radius: var(--radius-full); font-size: 12px; font-weight: 700;
}
.normal-stock-badge {
  background: rgba(6,214,160,0.1); color: var(--accent-green);
  padding: 3px 10px; border-radius: var(--radius-full); font-size: 12px; font-weight: 700;
}
.sold-cell { font-weight: 600; color: var(--text-secondary); }
.badge-cells { display: flex; gap: 4px; flex-wrap: wrap; }
.no-badge { color: var(--text-light); }

.action-btns { display: flex; gap: 6px; }
.delete-btn { background: rgba(239,35,60,0.08); color: var(--danger); }
.delete-btn:hover { background: var(--danger); color: white; }
.table-empty { text-align: center; color: var(--text-light); padding: 48px; }

/* Form Modal */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.img-preview-wrap { margin-bottom: 16px; }
.img-preview { width: 100%; max-height: 180px; object-fit: cover; border-radius: var(--radius-md); }
.form-checkboxes { display: flex; gap: 24px; margin-bottom: 20px; }
.checkbox-label {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; font-weight: 600; font-size: 14px;
}
.checkbox-label input { width: 16px; height: 16px; cursor: pointer; accent-color: var(--primary); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; }

.close-btn {
  width: 32px; height: 32px; border-radius: var(--radius-full);
  background: var(--border-light); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.close-btn:hover { background: var(--danger); color: white; }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .admin-stat { min-width: calc(50% - 8px); }
}
</style>
