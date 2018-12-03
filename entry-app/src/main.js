import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import containerHelper from './container-helper';
import GlobalMethods from '@/utils/global-methods';

Vue.config.productionTip = false;

Vue.use(GlobalMethods);

containerHelper.mountStoreInstance(store);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
