<template>
  <div class="child-wrapper">
    <h3>This is a child Page</h3>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'child-component',

  created() {
    console.log(this.$slots);
  },
};
</script>
