<template>
  <div
    class="widget-tooltip"
    v-if="isMouseOver"
    :style="{
      top: mousePos.y - 10 + 'px',
      left: mousePos.x + 'px'
    }"
  >
    <div>
      <b>{{ label }}</b>
      <div>{{ value }}</div>
    </div>
  </div>
</template>

<script>
import { useMap } from '@/hooks'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Tooltip',
  setup() {
    const { mousePos, isMouseOver } = useMap()

    return { mousePos, isMouseOver }
  }
})
</script>

<style lang="scss" scoped>
.widget-tooltip {
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -100%);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
}
</style>
