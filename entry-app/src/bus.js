export default {
  install(Vue) {
    Vue.prototype.$bus = new Vue({
      methods: {
        on(...args) {
          this.$on(...args);
        },

        once(...args) {
          this.$once(...args);
        },

        off(...args) {
          this.$off(...args);
        },

        emit(...args) {
          this.$emit(...args);
        },
      },
    });
  },
};
