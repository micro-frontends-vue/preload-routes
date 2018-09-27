import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from './load-module';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: { name: 'entry-app' },
  mutations: {},
  actions: {},
});

mount('store', store);

export default store;
