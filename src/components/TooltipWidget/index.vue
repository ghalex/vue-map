<template>
  <div
    class="widget-tooltip"
    v-if="data"
    :style="{
      top: pos.y - 15 + 'px',
      left: pos.x + 'px'
    }"
  >
    <slot :data="data">
      <div>
        <b>{{ data.name }}</b>
      </div>
    </slot>
  </div>
</template>

<script>
import { useMap } from '@/hooks'
import { defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'Tooltip',
  setup() {
    const { mouseClickPos, clickData, isMouseOver } = useMap()

    return { pos: mouseClickPos, data: clickData, isMouseOver }
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
