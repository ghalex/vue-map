import { ref, Ref, watch } from 'vue'
import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'

export default (elRef: Ref<any>) => {
  const transform = ref('')

  const zm: any = zoom()
    .scaleExtent([0, 8])
    .on('zoom', (e) => {
      const { x, y, k } = e.transform
      transform.value = `translate(${x}, ${y}) scale(${k})`
    })

  watch(elRef, () => {
    if (elRef.value) {
      zm(select(elRef.value))
    }
  })

  return { zm, transform }
}
