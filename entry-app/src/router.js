import Vue from 'vue';
import Router from 'vue-router';
import containerHelper from './container-helper';

Vue.use(Router);

const existedRoutes = containerHelper.getRoutes();
const router = new Router({
  routes: existedRoutes.concat([
    {
      path: '/',
      redirect: { name: 'sub-app-ts' },
    },
    {
      path: '*',
      component: () => import('@/views/NotFound.vue'),
    },
  ]),
});

export default router;
