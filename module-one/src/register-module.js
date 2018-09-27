import Vue from 'vue';

const DEFAULT_SHARED_POOL_NAME = 'microApp';

/**
 * register sub app/module
 *
 * @export
 * @param {string} moduleName app/module name
 * @param {object} [options={}]
 * @returns
 *
 * @example
 * registerModule('module-a', { routes, store, sharedPoolName: 'micro-frontend', log: false })
 */
export default function registerModule(moduleName, options = {}) {
  if (typeof moduleName === 'undefined' || typeof options !== 'object') {
    return;
  }

  const needLog = typeof options.log === 'undefined' ? true : !!options.log;
  const name =
    typeof options.sharedPoolName === 'undefined'
      ? DEFAULT_SHARED_POOL_NAME
      : options.sharedPoolName;

  // register routes
  const routerInstance = window[name].router;
  if (
    typeof routerInstance === 'object' &&
    typeof routerInstance.addRoutes === 'function' &&
    isArray(options.routes)
  ) {
    routerInstance.addRoutes(options.routes);
    log('register routes');
    if (typeof Vue.prototype.$bus === 'object') {
      Vue.prototype.$bus.$emit(
        'common:update-routes',
        options.routes.map(({ path, name, title }) => ({ path, name, title })),
      );
    }
  }

  // register store
  const storeInstance = window[name].store;
  if (
    typeof storeInstance === 'object' &&
    typeof storeInstance.registerModule === 'function' &&
    !storeInstance.state[moduleName] &&
    typeof options.store === 'object'
  ) {
    storeInstance.registerModule(moduleName, options.store);
    log('register store');
  }

  function log(msg) {
    needLog && console.log(`[${moduleName}]:`, msg);
  }
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}
