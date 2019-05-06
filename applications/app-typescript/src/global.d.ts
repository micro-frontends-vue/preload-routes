import Vue from 'vue';

declare module 'vue/types/vue' {
  interface VueConstructor {
    __share_pool__: any;
  }
}
