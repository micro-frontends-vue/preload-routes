import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import loadModule from '@/load-module';
import bus from '@/bus';

Vue.config.productionTip = false;

Vue.use(bus);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

const modules = [
  'http://localhost:7200/module-one/dist/module-one.umd.min.js',
  'http://localhost:7200/module-two/dist/module-two.umd.min.js',
];

Promise.all(modules.map((v) => loadModule(v))).then((res) => {
  console.log(res);
});
