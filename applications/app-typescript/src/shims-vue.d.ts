declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  export interface VueConstructor {
    __share_pool__: any;
  }
}
