import { onMounted, ref, Ref } from 'vue'
import { pointer, select } from 'd3-selection'

export default (elRef: Ref<any>) => {
  const mousePos = ref({ x: 0, y: 0 })
  const isMouseOver = ref(false)

  function onMouseOut(_, d) {
    isMouseOver.value = false
  }

  function onMouseMove(e: any) {
    mousePos.value = { x: pointer(e)[0], y: pointer(e)[1] }
    isMouseOver.value = true
  }

  onMounted(() => {
    select(elRef.value)
      .select('g')
      .on('mousemove', onMouseMove)
      .on('mouseout', onMouseOut)
      .on('mousedown', onMouseOut)
  })

  return { mousePos, isMouseOver }
}
