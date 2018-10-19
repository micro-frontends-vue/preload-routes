<template>
  <div class="page">
    <h3>This is a page: A</h3>

    <img class="image"
         src="@/assets/images/nodejs.png"
         alt="nodejs">
    <br>
    <p>Open the Chrome DevTools, there is an image loading error:</p>
    <div class="background"></div>
  </div>
</template>

<style lang="less">
.page {
  .image {
    width: 40vmin;
  }

  .background {
    display: inline-flex;
    width: 20vmin;
    height: 20vmin;
    background: #ea6e76 url('~@/assets/images/javascript.png') no-repeat;
    background-size: cover;
  }
}
</style>
