import { CreateRegister } from 'vue-module-register';
import store from '@/store/store-module';
import routes from '@/router/router-list';

const register = new CreateRegister({
  name: process.env.VUE_APP_NAME,
});

register.registerModule(store).addRoutes(routes);

Vue.config.devtools = process.env.NODE_ENV === 'development';
