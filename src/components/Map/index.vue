<template>
  <div class="map">
    <svg :width="width" :height="height" ref="svg" @click="onClickOutside">
      <g>
        <g
          v-for="(p, i) in paths"
          :key="i"
          class="map-region"
          @mouseover="(e) => onMouseOver(e, p.properties)"
          @mousemove="(e) => onMouseMove(e, p.properties)"
          @mouseout="(e) => onMouseOut(e, p.properties)"
          @click.stop="(e) => onMouseClick(e, p.properties)"
        >
          <path :d="p.d" :fill="p.fill" class="map-shape" :transform="transform" />
          <text
            :x="p.x"
            :y="p.y + 3"
            font-size="11"
            text-anchor="middle"
            class="map-text"
            fill="black"
            :transform="transform"
          >
            {{ p.properties.code }}
          </text>
          <text
            :x="p.x"
            :y="p.y + 9"
            font-size="6"
            text-anchor="middle"
            class="map-text"
            fill="black"
            :transform="transform"
          >
            {{ p.properties.name }}
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
import { pointer, select } from 'd3-selection'
import { zoom } from 'd3-zoom'

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
    const transform = ref('')
    const mousePos = ref({ x: 0, y: 0 })
    const mouseClickPos = ref({ x: 0, y: 0 })
    const isMouseOver = ref(false)
    const hoverData = ref(null)
    const clickData = ref(null)
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
          properties: s.properties
        }
      })
    })

    const zm: any = zoom()
      .scaleExtent([0, 8])
      .on('zoom', (e) => {
        const { x, y, k } = e.transform
        transform.value = `translate(${x}, ${y}) scale(${k})`
        clickData.value = null
      })

    provide('svg', svg)
    provide('zm', zm)

    provide('mousePos', mousePos)
    provide('mouseClickPos', mouseClickPos)
    provide('isMouseOver', isMouseOver)
    provide('hoverData', hoverData)
    provide('clickData', clickData)

    function updateProjection(w, h) {
      projection.value = geoMercator()
        .center([25, 46])
        .scale(w * 4)
        .translate([w / 2, h / 2])
    }

    function onMouseMove(e: any) {
      mousePos.value = { x: pointer(e)[0], y: pointer(e)[1] }
    }

    function onMouseOut() {
      isMouseOver.value = false
      hoverData.value = null
    }

    function onMouseOver(_, data: any) {
      isMouseOver.value = true
      hoverData.value = data
    }

    function onMouseClick(e: any, data: any) {
      clickData.value = data
      mouseClickPos.value = { x: pointer(e)[0], y: pointer(e)[1] }
    }

    function onClickOutside() {
      clickData.value = null
    }

    onMounted(async () => {
      shapes.value = await fetchShapes()
      updateProjection(props.width, props.height)
    })

    watch(props, () => {
      updateProjection(props.width, props.height)
    })

    watch(svg, () => {
      if (svg.value) {
        zm(select(svg.value))
      }
    })

    return { svg, paths, transform, onMouseMove, onMouseOut, onMouseOver, onMouseClick, onClickOutside }
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
