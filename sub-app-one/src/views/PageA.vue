<template>
  <div class="page">
    <h3>This is a page: A</h3>

    <p>
      <input type="text"
             v-model="value">
    </p>

    <img class="image"
         src="@/assets/images/nodejs.png"
         alt="nodejs">
    <br>
    <div class="background"></div>
  </div>
</template>

<script>
export default {
  name: 'one-page-a',
  autoStorage: ['value'],
  data() {
    return {
      value: '',
    };
  },
};
</script>

<style lang="less">
.page {
  .image {
    width: 40vmin;
  }

  .background {
    display: inline-flex;
    width: 20vmin;
    height: 20vmin;
    background: url('~@/assets/images/javascript.png') no-repeat;
    background-size: cover;
  }
}
</style>
