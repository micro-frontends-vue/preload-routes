import { CreateLoaderMixin } from 'vue-module-register';
import store from '@/store';
import router from '@/router';

const modules = [
  { name: 'sub-app-one', url: 'http://localhost:7310/sub-app-one/main.js' },
  { name: 'sub-app-two', url: 'http://localhost:7320/sub-app-two/main.js' },
];

export default new CreateLoaderMixin({
  modules,
  store,
  router,
  cache: false,
});
