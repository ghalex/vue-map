<template>
  <div>
    <div class="flex justify-center p-8">
      <div class="map-container">
        <Map :width="width" :fill="getFill">
          <template #widgets>
            <ZoomWidget />
            <TooltipWidget #default="{ data: { name, code } }">
              <div>
                <b>{{ name }}</b>
                <div>monumente: {{ data.get(code)[0].monumente }}</div>
              </div>
            </TooltipWidget>
            <div class="legend">
              <div class="legend-item" v-for="(item, i) in legend" :key="i">
                <span :style="{ backgroundColor: item.color }" /> {{ item.values[0] }} - {{ item.values[1] }}
              </div>
            </div>
          </template>
        </Map>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Map, ZoomWidget, TooltipWidget } from '@/components'
import { scaleQuantize } from 'd3-scale'
import { fetchData } from '@/data'
// import { extent } from 'd3-array'

export default {
  name: 'Home',
  components: { Map, ZoomWidget, TooltipWidget },
  setup() {
    const width = ref(800)
    const data = ref<Map<string, any> | null>(null)
    const colors = ['#FFAD00', '#FF8D00', '#00AAFC', '#00AC9D']
    const scale = scaleQuantize()
      .domain([0, 1600])
      .range(colors as any)

    const legend = computed(() => {
      const intervals = [0, ...scale.thresholds(), 3000]
      const res = [] as any[]

      for (let i = 0; i < colors.length; i++) {
        res.push({
          color: colors[i],
          values: [intervals[i], intervals[i + 1]]
        })
      }

      return res
    })

    function getFill({ properties }) {
      if (!data.value) {
        return '#CCC'
      }

      const extra = data.value.get(properties.code)
      if (extra) {
        return scale(extra[0].monumente)
      }

      return '#CCC'
    }

    onMounted(async () => {
      data.value = await fetchData()
    })

    return { width, data, getFill, legend }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.map-container {
  position: relative;
  border: 1px solid #ccc;
  background-color: #ededed;
}

.legend {
  left: 0;
  bottom: 0;
  position: absolute;
  margin: 12px 12px;
  .legend-item {
    padding: 0 12px;

    span {
      display: inline-block;
      width: 12px;
      height: 12px;
    }
  }
}
</style>
