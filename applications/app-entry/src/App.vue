<template>
  <div id="app">
    <div id="nav">
      <router-link
        v-for="r in routes"
        :key="r.name"
        :to="r.name"
        :class="{ active: r.isActive }"
        class="link"
        >{{ r.title }}</router-link
      >
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'entry-application',

  data() {
    return {
      routes: [
        { name: '/app-typescript', title: 'app-typescript' },
        { name: '/app-javascript', title: 'app-javascript' },
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
      const activedRoute = this.routes.find(({ name }) =>
        path.startsWith(name),
      );
      if (activedRoute) {
        activedRoute.isActive = true;
      }
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  padding: 0 10px;
  font-weight: bold;
  color: #2c3e50;
}

#nav a.active,
#nav a.router-link-exact-active {
  color: #ea6e76;
}
</style>
