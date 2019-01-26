import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 获取子项目的 route-list
const routes = Vue.prototype.__share_pool__.routes;

export default new Router({
  routes: Object.values(routes).reduce((acc, prev) => {
    return acc.concat(prev);
  }, []),
});
