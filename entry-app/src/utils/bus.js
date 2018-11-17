import Vue from 'vue';

export default new Vue({
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
