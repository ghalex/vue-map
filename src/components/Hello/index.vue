<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Hello!
    </p>
  </div>
</template>

<script setup lang="ts">
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
