<template>
  <div>
    <div class="flex justify-center p-8 bg-blue-100">
      <Map />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Map } from '@/components'

export default {
  name: 'Home',
  components: { Map }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
