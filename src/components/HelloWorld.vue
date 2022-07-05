<script setup>
import { onMounted } from 'vue'
// import pdfjsLib from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import Konva from 'konva'

GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js'
// console.log(workerSrc);
// GlobalWorkerOptions.workerSrc = workerSrc;

// onMounted(() => {
//   renderPDF()
//   setTimeout(() => {
//     drapRect()
//   }, 3000)
// })

function drapRect () {
  const canvas = document.getElementById('the-canvas')
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'green'
  ctx.strokeRect(0, 0, 100, 100)
}

function renderPDF () {
  getDocument('/src/assets/UML.pdf')
    .promise.then(function (pdf) {
      pdf.getPage(1).then((page) => {
        const scale = 1.5
        const viewport = page.getViewport({ scale })
        const outputScale = window.devicePixelRatio || 1

        const canvas = document.getElementById('the-canvas')
        const context = canvas.getContext('2d')

        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.style.width = Math.floor(viewport.width) + 'px'
        canvas.style.height = Math.floor(viewport.height) + 'px'

        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

        const renderContext = {
          canvasContext: context,
          transform,
          viewport
        }
        page.render(renderContext)
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

function mousemoveHandle (e) {
  console.log(e)
  const canvas = document.getElementById('the-canvas')
  console.log(canvas.getBoundingClientRect())
}

</script>

<template>
  <canvas
    id="the-canvas"
    @mousedown="mousemoveHandle"
  />
  <div id="container" />
</template>

<style scoped>
a {
  color: #42b983;
}

#the-canvas {
  border: 1px solid blue;
}
</style>
