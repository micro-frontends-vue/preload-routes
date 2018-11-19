import bus from './bus';
import { CreateRegister } from 'vue-module-register';

const shared = {
  $bus: bus,
  $sharedMethods: {
    CreateRegister,
  },
};

export default {
  install(Vue) {
    Object.defineProperties(
      Vue.prototype,
      Object.entries(shared).reduce((acc, [k, v]) => {
        acc[k] = {
          get() {
            return v;
          },
        };
        return acc;
      }, {}),
    );
  },
};
