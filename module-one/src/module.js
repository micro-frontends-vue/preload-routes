import store from '@/store/store-module';
import routes from '@/router/router-list';
import registerModule from '@/register-module';

registerModule(process.env.VUE_APP_NAME, { routes, store });

export default { routes, store };
