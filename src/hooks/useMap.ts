import { inject, ref } from 'vue'

export default () => {
  const svg = inject('svg', ref(null))
  const zm = inject<any>('zm', null)
  const mousePos = inject('mousePos', ref({ x: 0, y: 0 }))
  const mouseClickPos = inject('mouseClickPos', ref({ x: 0, y: 0 }))
  const isMouseOver = inject('isMouseOver', false)
  const hoverData = inject('hoverData', ref({}))
  const clickData = inject('clickData', ref(null))

  return { svg, zm, mousePos, mouseClickPos, hoverData, clickData, isMouseOver }
}
