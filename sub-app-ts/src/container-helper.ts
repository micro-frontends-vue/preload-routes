import ContainerHelper from 'vue-module-register';

export default new ContainerHelper({
  name: process.env.VUE_APP_NAME as string,
  poolName: '__share_pool__',
});
