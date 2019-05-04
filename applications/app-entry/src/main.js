import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// 挂载主项目的 store 实例
(Vue.__share_pool__ = Vue.__share_pool__ || {}).store = store;

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  },
}).$mount('#app');
