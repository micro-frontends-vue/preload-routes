import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'sub-app-one' },
    },
  ],
});

export default router;
