<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/src/assets/pdf.worker.js";
// 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js'

onMounted(() => {
  // renderPDF();
  readPDF();
});

const canvasIdArr = reactive([]);
let canvasScale = ref(1.5);

function readPDF() {
  function generateCanvasId(num) {
    let count = 1;
    while (count <= num) {
      canvasIdArr.push(`canvas-page-${count}`);
      count++;
    }
  }
  getDocument("/src/assets/UML.pdf").promise.then((pdf) => {
    if (!canvasIdArr.length) generateCanvasId(pdf.numPages); // 根据页数生成canvas id数量
    canvasIdArr.forEach((canvasId, index) => {
      pdf.getPage(index + 1).then((page) => {
        var scale = canvasScale.value;
        var viewport = page.getViewport({ scale: scale });
        var outputScale = window.devicePixelRatio || 1;

        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        var transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        var renderContext = {
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        };
        page.render(renderContext);
      });
    });
  });
}

function enlargementCanvas() {
  canvasScale.value = (canvasScale.value * 10 + 0.1 * 10) / 10;
  console.log(canvasScale.value);
  readPDF();
}

function shrinkCanvas() {
  canvasScale.value = (canvasScale.value * 10 - 0.1 * 10) / 10;
  readPDF();
}
</script>
<template>
  <section class="canvas-render-pdf">
    <div class="canvas-container">
      <div v-for="id in canvasIdArr" :key="id" :data-page="id">
        <canvas :id="id" class="canvas" />
      </div>
    </div>
    <div class="tools">
      <button @click="shrinkCanvas">缩小</button>
      <button @click="enlargementCanvas">放大</button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.canvas {
  border: 1px solid rgb(109, 100, 88);
  margin-top: 20px;
}
.canvas-render-pdf {
  display: flex;
  .canvas-container {
    flex: 1;
  }
  .tools {
    width: 200px;
  }
}
</style>
