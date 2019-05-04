import Vue from 'vue';
import routes from './routes';

const sharePool = (Vue.__share_pool__ = Vue.__share_pool__ || {});
const routesPool = (sharePool.routes = sharePool.routes || {});

// 挂载子项目的 route-list
routesPool[process.env.VUE_APP_NAME] = routes;
