<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import konvaStage from "../utils/konva.js";

GlobalWorkerOptions.workerSrc = "/src/assets/pdf.worker.js";
// 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js'

onMounted(() => {
  initCanvasStage();
});

const canvasIdArr = reactive([]);
let canvasScale = ref(1.5);
let konvaStageArray = reactive([]);

function initCanvasStage() {
  // 根据输入数量，生成canvasId
  function generateCanvasId(num) {
    let count = 1;
    while (count <= num) {
      canvasIdArr.push(`canvas-page-${count}`);
      count++;
    }
  }

  // 根据canvasId数量，生成Konva Stage数量
  function generateKonvaStage(canvasIdArr) {
    canvasIdArr.forEach((id) => {
      konvaStageArray.push(
        konvaStage(id, 800, 1280, initCanvasStage.bind(this))
      );
    });
  }

  getDocument("/src/assets/UML.pdf").promise.then((pdf) => {
    if (!canvasIdArr.length) generateCanvasId(pdf.numPages); // 根据页数生成canvas id数量
    nextTick(() => {
      if (canvasIdArr.length && !konvaStageArray.length)
        generateKonvaStage(canvasIdArr); // 根据页数生成konva stage数量
      renderPDF();
    });
  });
}

function renderPDF() {
  if (!canvasIdArr.length || !konvaStageArray.length)
    throw new Error("Please run initCanvasStage first");
  // 找到canvas节点
  function findCanvasNode(id) {
    let node = document.getElementById(id);
    let childNodes = node.childNodes;
    let descendantNodes = childNodes[0].childNodes;
    return descendantNodes[0];
  }
  getDocument("/src/assets/UML.pdf").promise.then((pdf) => {
    let pageNumber = pdf.numPages;
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      (function (currentPage) {
        pdf.getPage(currentPage).then((page) => {
          var scale = canvasScale.value;
          var viewport = page.getViewport({ scale: scale });
          var outputScale = window.devicePixelRatio || 1;
          var canvas = findCanvasNode(canvasIdArr[currentPage - 1]);
          var context = canvas.getContext("2d");
          var transform =
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
          var renderContext = {
            canvasContext: context,
            transform: transform,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      })(currentPage);

      currentPage++;
    }
  });
}
</script>
<template>
  <section class="canvas-render-pdf">
    <!-- 可添加的元素 -->
    <div class="diagram-container">
      <div class="square" draggable="true"></div>
    </div>
    <div class="canvas-container">
      <div
        v-for="id in canvasIdArr"
        :key="id"
        :data-page="id"
        :id="id"
        class=""
      ></div>
    </div>
    <!-- 元素的坐标，页数信息 -->
    <div class="diagram-coordinates">
      <button @click="initCanvasStage">渲染PDF</button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.canvas-render-pdf {
  display: flex;
  .diagram-container,
  .diagram-coordinates {
    width: 400px;
  }
  .canvas-container {
    flex: 1;
  }
  .diagram-container {
    .square {
      width: 100px;
      height: 100px;
      border: 1px solid #000;
    }
  }
}
</style>
<style>
.konvajs-content {
  border: 1px solid red;
  margin: 0 auto 10px auto;
}
</style>
