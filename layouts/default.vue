<template>
  <div class="layout">
    <AppHeader />
    <CartDrawer />

    <!-- Toast Notification -->
    <div class="toast-container">
      <transition name="slide-toast">
        <div v-if="toast" class="toast" :class="`toast-${toast.type}`">
          <span>{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}</span>
          {{ toast.message }}
        </div>
      </transition>
    </div>

    <main class="page-wrapper">
      <nuxt />
    </main>

    <AppFooter />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  computed: {
    toast() { return this.$store.state.toast }
  }
}
</script>

<style>
.slide-toast-enter-active, .slide-toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-toast-enter, .slide-toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
