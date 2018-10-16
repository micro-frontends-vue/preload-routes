<template>
  <div class="page">
    <h3>This is a page: A</h3>

    <img class="image"
         src="@/assets/images/nodejs.png"
         alt="nodejs">

    <div class="background"></div>
  </div>
</template>

<style lang="less">
.page {
  .image {
    width: 40vmin;
  }

  .background {
    width: 20vmin;
    height: 20vmin;
    background: url('~@/assets/images/javascript.png') no-repeat;
    background-size: cover;
  }
}
</style>
