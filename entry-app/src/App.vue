<template>
  <div id="app">
    <div id="nav">
      <router-link v-for="r in routes"
                   :key="r.name"
                   :to="{name: r.name}"
                   :class="{active: r.isActive}"
                   class="link">{{ r.title }}</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'EntryApp',

  data() {
    return {
      routes: [
        { name: 'module-one', title: 'module-one' },
        { name: 'module-two', title: 'module-two' },
      ],
    };
  },

  watch: {
    $route({ name }) {
      if (typeof name === 'undefined') {
        return;
      }
      const appName = name.split('.')[0];
      // remove active class
      const olsActivedRoute = this.routes.find((v) => v.isActive);
      if (olsActivedRoute) {
        olsActivedRoute.isActive = false;
      }
      // add active class
      const activedRoute = this.routes.find(({ name }) => name === appName);
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
