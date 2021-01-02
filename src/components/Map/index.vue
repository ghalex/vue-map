<template>
  <div class="map">
    <svg :width="width" :height="height" ref="svg">
      <g>
        <g
          v-for="(p, i) in paths"
          :key="i"
          class="map-region"
          @mousemove="onMouseMove"
          @mouseout="onMouseOut"
          :transform="transform"
        >
          <path :d="p.d" :fill="p.fill" class="map-shape" />
          <text :x="p.x" :y="p.y + 3" font-size="11" text-anchor="middle" class="map-text" fill="black">
            {{ p.code }}
          </text>
          <text :x="p.x" :y="p.y + 9" font-size="6" text-anchor="middle" class="map-text" fill="black">
            {{ p.label }}
          </text>
        </g>
      </g>
    </svg>
    <div class="map-widgets">
      <slot name="widgets" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { geoMercator, geoPath } from 'd3-geo'
import { fetchShapes } from '@/data'
import { useMouse, useZoom } from '@/hooks'
import { pointer } from 'd3-selection'

export default {
  name: 'Map',
  props: {
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 400
    },
    fill: {
      type: Function,
      default: () => 'green'
    }
  },
  setup(props) {
    const svg = ref(null)
    const shapes = ref([] as any)
    const { zm, transform } = useZoom(svg)
    const { mousePos, isMouseOver } = useMouse(svg)
    // const mousePos = ref({ x: 0, y: 0 })
    // const isMouseOver = ref(false)
    const projection = ref<any>(null)

    const paths = computed(() => {
      if (!projection.value) {
        return []
      }

      const path: any = geoPath().projection(projection.value)

      return shapes.value.map((s: any) => {
        return {
          d: path(s),
          fill: props.fill(s),
          x: path.centroid(s)[0],
          y: s.properties.code !== 'IF' ? path.centroid(s)[1] : path.centroid(s)[1] - 10,
          code: s.properties.code,
          label: s.properties.code !== 'B' ? s.properties.name : ''
        }
      })
    })

    provide('svg', svg)
    provide('zm', zm)
    provide('mousePos', mousePos)
    provide('isMouseOver', isMouseOver)

    function updateProjection(w, h) {
      projection.value = geoMercator()
        .center([25, 46])
        .scale(w * 4)
        .translate([w / 2, h / 2])
    }

    function onMouseMove(e: any) {
      //isMouseOver.value = true
      //mousePos.value = { x: e.clientX, y: e.clientY }
    }

    function onMouseOut() {
      //isMouseOver.value = false
    }

    onMounted(async () => {
      shapes.value = await fetchShapes()
      updateProjection(props.width, props.height)
    })

    watch(props, () => {
      updateProjection(props.width, props.height)
    })

    return { svg, paths, transform, onMouseMove, onMouseOut }
  }
}
</script>

<style lang="scss">
.map svg {
  position: relative;
}

.map-shape {
  stroke: white;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.map-region:hover {
  opacity: 0.8;
}

.map-widgets {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  & * {
    pointer-events: all;
  }
}

.map-text {
  pointer-events: none;
  user-select: none;
  opacity: 0.4;
}

.map-tooltip {
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
