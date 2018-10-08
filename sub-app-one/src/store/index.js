import Vue from 'vue';
import Vuex from 'vuex';
import store from './store-module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { [process.env.VUE_APP_NAME]: store },
  strict: process.env.NODE_ENV === 'development',
});
