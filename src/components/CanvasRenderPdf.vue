<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = '/src/assets/pdf.worker.js'
// 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js'

onMounted(() => {
  renderPDF()
})

const canvasIdArr = reactive([])
const canvasWidth = ref(612)
const canvasHeight = ref(792)

function renderPDF () {
  function generateCanvasId (num) {
    let count = 1
    while (count <= num) {
      canvasIdArr.push(`canvas-page-${count}`)
      count++
    }
  }
  getDocument('/src/assets/UML.pdf').promise.then(pdf => {
    const pageNums = pdf.numPages // pdf总页数
    generateCanvasId(pageNums) // 根据页数生成canvas元素id
    canvasIdArr.forEach((canvasId, index) => {
      pdf.getPage(index + 1).then((page) => {
        // const scale = 1
        const viewport = page.getViewport({ scale: 1 })
        const scale = canvasWidth.value / viewport.width
        const scaleViewport = page.getViewport({ scale })
        const canvas = document.getElementById(canvasId)
        const context = canvas.getContext('2d')
        page.render({
          canvasContext: context,
          viewport: scaleViewport
        })
      })
    })
  })
}

// function initCanvasWidthHeight (canvasId) {
//   const dpr = window.devicePixelRatio
//   const canvas = document.getElementById(canvasId)
//   const { width, height } = canvas.getBoundingClientRect()
//   canvasWidth.value = dpr * width
//   canvasHeight.value = dpr * height
// }

</script>
<template>
  <div
    v-for="id in canvasIdArr"
    :key="id"
  >
    <canvas
      :id="id"
      class="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>
<style lang='scss' scoped>
.canvas {
  width: 612px;
  height: 792px;
  border: 1px solid rgb(109, 100, 88);
  margin-top: 20px;
}
</style>
