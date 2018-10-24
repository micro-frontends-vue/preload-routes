<template>
  <div id="app">
    <div id="nav">
      <router-link v-for="r in routes"
                   :key="r.name"
                   :to="r.name"
                   :class="{active: r.isActive}"
                   class="link">{{ r.title }}</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import loaderMixin from '@/loader-mixin';

export default {
  name: 'EntryApp',

  mixins: [loaderMixin],

  data() {
    return {
      routes: [
        { name: '/sub-app-one', title: 'sub-app-one' },
        { name: '/sub-app-two', title: 'sub-app-two' },
      ],
    };
  },

  watch: {
    $route({ path }) {
      if (typeof path === 'undefined') {
        return;
      }
      // remove active class
      const oldActivedRoute = this.routes.find((v) => v.isActive);
      if (oldActivedRoute) {
        oldActivedRoute.isActive = false;
      }
      // add active class
      const activedRoute = this.routes.find(({ name }) => path.startsWith(name));
      if (activedRoute) {
        activedRoute.isActive = true;
      }
    },
  },
};
</script>


<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    padding: 0 10px;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active,
    &.active {
      color: #42b983;
    }
  }
}
</style>
