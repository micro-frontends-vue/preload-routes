<template>
  <div class="page">
    <h3>This is a page: B</h3>

    <child>
      <p>no slot name, top</p>
      <p slot="footer">slot name: footer 1</p>
      <p slot="footer">slot name: footer 2</p>
      <p>no slot name, bottom</p>
      <p slot="header">slot name: header</p>
    </child>
  </div>
</template>

<script>
import Child from './Child';

export default {
  name: 'page-b',

  components: {
    Child,
  },
};
</script>
