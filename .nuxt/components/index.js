export { default as AppFooter } from '../..\\components\\AppFooter.vue'
export { default as AppHeader } from '../..\\components\\AppHeader.vue'
export { default as CartDrawer } from '../..\\components\\CartDrawer.vue'
export { default as FilterBar } from '../..\\components\\FilterBar.vue'
export { default as ProductCard } from '../..\\components\\ProductCard.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
