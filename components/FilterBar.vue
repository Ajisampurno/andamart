<template>
  <div class="filter-bar">
    <!-- Category Chips -->
    <div class="filter-categories">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="chip"
        :class="activeCategory === cat.value ? 'chip-active' : 'chip-inactive'"
        @click="$emit('category-change', cat.value)"
        :id="`filter-cat-${cat.value}`"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- Sort Select -->
    <div class="filter-sort">
      <span class="sort-label">Urutkan:</span>
      <select
        class="form-control sort-select"
        :value="activeSort"
        @change="$emit('sort-change', $event.target.value)"
        id="filter-sort-select"
      >
        <option value="popular">🔥 Terpopuler</option>
        <option value="newest">✨ Terbaru</option>
        <option value="bestseller">🏆 Best Seller</option>
        <option value="price_asc">💰 Harga: Terendah</option>
        <option value="price_desc">💰 Harga: Tertinggi</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    activeCategory: { type: String, default: 'semua' },
    activeSort: { type: String, default: 'popular' }
  },
  data() {
    return {
      categories: [
        { value: 'semua', label: 'Semua', icon: '🍴' },
        { value: 'makanan', label: 'Makanan', icon: '🍽' },
        { value: 'minuman', label: 'Minuman', icon: '🥤' },
        { value: 'cemilan', label: 'Cemilan', icon: '🍿' }
      ]
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  background: white;
  border-radius: var(--radius-xl);
  padding: 16px 20px;
  box-shadow: var(--shadow-md);
  margin-bottom: 32px;
}
.filter-categories {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-sort {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.sort-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}
.sort-select {
  min-width: 180px;
  padding: 9px 36px 9px 14px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 0;
}
@media (max-width: 640px) {
  .filter-bar { flex-direction: column; align-items: stretch; }
  .filter-sort { justify-content: space-between; }
  .sort-select { flex: 1; }
}
</style>
