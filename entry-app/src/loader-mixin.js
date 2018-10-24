import { CreateLoaderMixin } from 'vue-module-register';
import store from '@/store';
import router from '@/router';

const modules = [
  { name: 'sub-app-one', url: 'http://localhost:7200/sub-app-one/dist/sub-app-one.umd.min.js' },
  { name: 'sub-app-two', url: 'http://localhost:7200/sub-app-two/dist/sub-app-two.umd.min.js' },
];

export default new CreateLoaderMixin({
  modules,
  store,
  router,
  cache: false,
});
