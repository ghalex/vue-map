<template>
  <div class="map">
    <svg ref="svgRef" />
    <div class="map-tooltip" ref="tooltipRef">
      <b>{{ countyName }}</b>
      <div>population: {{ countyValue }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { geoMercator, geoPath } from 'd3-geo'
import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'
import { scaleSequential } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'
import { extent } from 'd3-array'
// import { interpolateWarm } from 'd3-scale-chromatic'
import { fetchData, fetchShapes } from '@/data'

export const svgRef = ref(null)
export const tooltipRef = ref(null)

export const countyName = ref('')
export const countyValue = ref('')

function createMap(data, width, height) {
  const svg = select(svgRef.value)
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g')
  const tip = select(tooltipRef.value)
  const population = data.filter((d) => d.properties.code !== 'B').map((d) => d.properties.pop2011)
  const scale = scaleSequential()
    .domain(extent(population))
    .interpolator(interpolateHcl('lightblue', 'blue'))

  scale.clamp(true)

  const projection = geoMercator()
    .center([25, 46])
    .scale(width * 5)
    .translate([width / 2, height / 2])

  const path = geoPath().projection(projection)
  const zm = zoom()
    .scaleExtent([1, 8])
    .on('zoom', (e) => {
      g.selectAll('path').attr('transform', e.transform)
    })

  function handleMouseOver(_, { properties: { name, pop2011 } }) {
    countyName.value = name
    countyValue.value = pop2011

    select(this).attr('fill', 'red')
    tip.style('visibility', 'visible')
  }

  function handleMouseOut(_, d) {
    select(this).attr('fill', scale(d.properties.pop2011))
    tip.style('visibility', 'hidden')
  }

  function handleMouseMove(evt) {
    tip.style('top', evt.clientY - 10 + 'px').style('left', evt.clientX + 'px')
  }

  g.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'map-shape')
    .attr('d', path)
    .attr('fill', (d) => scale(d.properties.pop2011))
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('mousemove', handleMouseMove)
    .on('mousedown', () => {
      tip.style('visibility', 'hidden')
    })

  svg.call(zm)
}

onMounted(async () => {
  const shapes = await fetchShapes()
  const data = await fetchData()

  const width = 500 //root.offsetWidth
  const height = 500

  console.log(data)
  createMap(shapes, width, height)
})

export default {
  name: 'Map'
}
</script>

<style lang="scss">
.map svg {
  position: relative;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  //background-image: url('~../../assets/bg.jpg');
  border-radius: 16px;
}

.map-shape {
  stroke: white;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
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
