<template>
  <div class="widget-zoom">
    <div class="flex flex-col">
      <button @click="() => zoomBy(1 + increment)">+</button>
      <button @click="() => zoomBy(1 - increment)">-</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useMap } from '@/hooks'
import { select } from 'd3-selection'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ZoomBar',
  props: {
    increment: {
      type: Number,
      default: 0.25
    }
  },
  setup() {
    const { zm, svg } = useMap()

    function zoomBy(val: number) {
      if (svg.value) {
        const el = select(svg.value) as any
        zm.scaleBy(el.transition().duration(100), val)
      }
    }

    return { zoomBy }
  }
})
</script>

<style scoped lang="scss">
.widget-zoom {
  position: absolute;
  top: 14px;
  right: 14px;
  border: 2px solid #888;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.widget-zoom button {
  padding: 4px 10px;
  outline: none;

  &:hover {
    background-color: #ccc;
    color: white;
  }

  &:first-child {
    border-bottom: 2px solid #888;
  }
}
</style>
