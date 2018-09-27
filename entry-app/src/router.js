import Vue from 'vue';
import Router from 'vue-router';
import { mount } from './load-module';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'module-one' },
    },
  ],
});

mount('router', router);

export default router;
