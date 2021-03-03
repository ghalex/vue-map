<template>
  <div>
    <div class="flex flex-col items-center justify-center p-8">
      <div>
        <h2 class="text-4xl mb-2 text-gray-800">Harta Romania</h2>
      </div>
      <div class="">
        <div class="toolbar flex w-full py-2 justify-center">
          <div
            v-for="(t, i) in tabs"
            :key="i"
            class="btn "
            :class="{ 'btn-green': tab === i }"
            @click="() => changeTab(i)"
          >
            {{ t }}
          </div>
        </div>
        <div v-if="!loading" class="map-container">
          <Map :width="width" :fill="getFill">
            <template #widgets>
              <ZoomWidget />
              <PopupWidget>
                <template #default="p">
                  <div class="overflow-hidden" v-if="data.get(p.data.code)">
                    <div class="bg-green-300 rounded-t text-gray-800 px-2 py-2 font-bold">
                      {{ p.data.name }} ({{ data.get(p.data.code).length }} {{ tabs[tab].toLowerCase() }})
                    </div>
                    <ul class="maxH list-inside list-decimal p-2 text-gray-800">
                      <li v-for="(item, i) in data.get(p.data.code)" :key="i">{{ item.nume }}</li>
                    </ul>
                  </div>
                  <div v-else>
                    <div class="bg-green-300 rounded-t text-gray-800 px-2 py-2 font-bold">
                      {{ p.data.name }}
                    </div>
                    <ul class="maxH list-inside list-decimal p-2">
                      Nu avem date
                    </ul>
                  </div>
                </template>
              </PopupWidget>
              <div class="legend">
                <div class="legend-item" v-for="(item, i) in legend" :key="i">
                  <div v-if="i < legend.length - 1">
                    <span :style="{ backgroundColor: item.color }" /> {{ item.values[0] }} -
                    {{ item.values[1] }}
                  </div>
                  <div v-else><span :style="{ backgroundColor: item.color }" /> {{ item.values[0] }} or more</div>
                </div>
              </div>
            </template>
          </Map>
        </div>
        <div class="loading" v-else>Loading data...</div>
      </div>
      <div class="mt-2">
        Data source:
        <a class="text-orange-600" href="https://ro.wikipedia.org/wiki/Lista_monumentelor_istorice_din_Rom%C3%A2nia"
          >Wikipedia</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Map, ZoomWidget, PopupWidget } from '@/components'
import { scaleQuantize } from 'd3-scale'
import { extent } from 'd3-array'
import { fetchData } from '@/data'
// import { extent } from 'd3-array'

export default {
  name: 'Home',
  components: { Map, ZoomWidget, PopupWidget },
  setup() {
    const width = ref(800)
    const cach: any = {}
    const data = ref<Map<string, any> | null>(null)
    const colors = ['#FFAD00', '#FF8D00', '#00AAFC', '#00AC9D']
    const domain = ref([0, 1])
    const tabs = ['Muzee', 'Artisti', 'Monumente']
    const tab = ref(1)
    const loading = ref(true)

    let scale = scaleQuantize()

    const legend = computed(() => {
      const intervals = [1, ...scale.thresholds().map((x) => Math.round(x)), domain.value[1]]
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
        return scale(extra.length)
      }

      return '#CCC'
    }

    function changeData(d: Map<string, any>) {
      data.value = d
      domain.value = extent(
        Array.from(d.entries()).map(([key, arr]) => {
          if (tab.value === 2) {
            return arr.length
          }
          return key === 'IF' ? 0 : arr.length
        })
      ) as any

      scale = scaleQuantize()
        .domain(domain.value)
        .range(colors as any)
    }

    function changeTab(i: number) {
      const data = cach[tabs[i].toLowerCase()]
      tab.value = i

      if (data) {
        changeData(data)
      }
    }

    onMounted(async () => {
      loading.value = true

      try {
        cach.artisti = await fetchData('artisti.csv')
        cach.muzee = await fetchData('muzee.csv')
        cach.monumente = await fetchData('monumente.csv')

        changeData(cach.artisti)
      } catch (e) {
        console.log(e)
      }

      loading.value = false
    })

    return { width, data, getFill, legend, tab, tabs, changeTab, loading }
  }
}
</script>

<style lang="postcss" scoped>
h3 {
  margin: 40px 0 0;
}

.toolbar {
  background: #ededed;
  border: 1px solid #ccc;
  margin-bottom: -1px;
}

.loading {
  width: 500px;
  border: 1px solid #ccc;
  padding: 8px;
  background: #ededed;
  text-align: center;
}
.btn {
  @apply shadow m-1 cursor-pointer text-gray-700 px-8 py-2;

  background-color: white;
  border-radius: 8px;
}

.btn:hover {
  opacity: 0.8;
}

.btn-green {
  @apply bg-green-600 text-white;
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
}

.legend-item {
  padding: 0 12px;
}

.legend-item span {
  display: inline-block;
  width: 12px;
  height: 12px;
}

.maxH {
  max-height: 200px;
  overflow-y: auto;
}
</style>
