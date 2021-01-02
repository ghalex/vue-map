import { inject, ref } from 'vue'

export default () => {
  const svg = inject('svg', ref(null))
  const zm = inject<any>('zm', null)
  const mousePos = inject('mousePos', ref({ x: 0, y: 0 }))
  const isMouseOver = inject('isMouseOver', false)

  return { svg, zm, mousePos, isMouseOver }
}
