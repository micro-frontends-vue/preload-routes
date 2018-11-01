import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import bus from '@/bus';

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV === 'development';

Vue.use(bus);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
