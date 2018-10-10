<template>
  <div class="module-app sub-app-one">
    <h1>{{ name }}</h1>
    <div class="nav">
      <router-link class="link"
                   :to="{name: 'sub-app-one.page-a'}">PageA</router-link>
      <router-link class="link"
                   :to="{name: 'sub-app-one.page-b'}">PageB</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ModuleOneIndex',

  data() {
    return {
      name: process.env.VUE_APP_NAME,
    };
  },
};
</script>

<style lang="less">
.nav {
  padding: 30px;
}

.link {
  padding: 0 10px;
  font-weight: bold;
  color: #2c3e50;

  &.router-link-exact-active {
    color: #42b983;
  }
}
</style>
