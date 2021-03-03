<template>
  <div class="widget-popup" v-if="data">
    <slot :data="data">
      <div>
        <b>{{ data.name }}</b>
      </div>
    </slot>
  </div>
</template>

<script>
import { useMap } from '@/hooks'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PopupWidget',
  setup() {
    const { clickData } = useMap()

    // watch(clickData, () => console.log(clickData.value))
    return { data: clickData }
  }
})
</script>

<style lang="scss" scoped>
.widget-popup {
  background-color: white;
  border-radius: 8px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  min-width: 280px;
  max-width: 400px;
}
</style>
