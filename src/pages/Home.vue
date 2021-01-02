<template>
  <div>
    <div class="flex justify-center p-8">
      <div class="map-container">
        <Map :width="width" :fill="getFill">
          <template #widgets>
            <ZoomWidget />
            <TooltipWidget />
          </template>
        </Map>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
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

    function getFill({ properties }) {
      if (!data.value) {
        return '#CCC'
      }

      const colors = ['#FFAD00', '#FF8D00', '#00AAFC', '#00AC9D']
      //const domain = extent(Array.from(data.value.values()).map((x) => parseInt(x[0].monumente))) as [number, number]
      const scale = scaleQuantize()
        .domain([0, 1600])
        .range(colors as any)

      const extra = data.value.get(properties.code)
      if (extra) {
        return scale(extra[0].monumente)
      }

      return '#CCC'
    }

    onMounted(async () => {
      data.value = await fetchData()
    })

    return { width, getFill }
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
</style>
