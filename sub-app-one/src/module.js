import Vue from 'vue';
import store from '@/store/store-module';
import routes from '@/router/router-list';
import('./async-chunks');

const CreateRegister = Vue.prototype.$sharedMethods.CreateRegister;

const register = new CreateRegister({
  name: process.env.VUE_APP_NAME,
});

register.registerModule(store).addRoutes(routes);
