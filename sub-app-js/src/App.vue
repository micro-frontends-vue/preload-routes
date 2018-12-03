<template>
  <div class="sub-app-js">
    <div class="nav">
      <router-link to="/sub-app-js/home">Home</router-link> |
      <router-link to="/sub-app-js/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
.sub-app-js {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>
