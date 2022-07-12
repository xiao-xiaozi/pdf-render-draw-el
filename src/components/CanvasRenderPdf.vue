<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import konvaStage from "../utils/konva.js";
import Konva from "konva";

GlobalWorkerOptions.workerSrc = "/src/assets/pdf.worker.js";
// 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js'

onMounted(() => {
  // renderPDF();
  readPDF();
});

const canvasIdArr = reactive([]);
let canvasScale = ref(1.5);
let konvaStageArray = reactive([]);

function readPDF() {
  function generateCanvasId(num) {
    let count = 1;
    while (count <= num) {
      canvasIdArr.push(`canvas-page-${count}`);
      count++;
    }
  }

  function generateKonvaStage(canvasIdArr) {
    canvasIdArr.forEach((id) => {
      konvaStageArray.push(konvaStage(id, 800, 1280));
    });
  }

  function findNode(id) {
    let node = document.getElementById(id);
    let childNodes = node.childNodes;
    let descendantNodes = childNodes[0].childNodes;
    return descendantNodes[0];
  }

  getDocument("/src/assets/UML.pdf").promise.then((pdf) => {
    if (!canvasIdArr.length) generateCanvasId(pdf.numPages); // 根据页数生成canvas id数量
    nextTick(() => {
      if (canvasIdArr.length) generateKonvaStage(canvasIdArr); // 根据页数生成konva stage数量
      testFn(konvaStageArray[0]);
    });
    let pageNumber = pdf.numPages;
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      (function (currentPage) {
        pdf.getPage(currentPage).then((page) => {
          var scale = canvasScale.value;
          var viewport = page.getViewport({ scale: scale });
          var outputScale = window.devicePixelRatio || 1;
          var canvas = findNode(canvasIdArr[currentPage - 1]);
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

function testFn(stage) {
  let layer = new Konva.Layer();
  var box = new Konva.Rect({
    x: 1 * 30 + 50,
    y: 1 * 18 + 40,
    fill: "orange",
    stroke: "black",
    strokeWidth: 4,
    draggable: true,
    width: 100,
    height: 100,
  });
  box.on("dragstart", function () {
    this.moveToTop();
  });

  box.on("dragmove", function () {
    document.body.style.cursor = "pointer";
  });
  // 限制拖拽边界
  box.dragBoundFunc(function (pos) {
    var newPos = {
      x: pos.x,
      y: pos.y,
    };
    if (newPos.x < 0) {
      newPos.x = 0;
    }
    if (newPos.y < 0) {
      newPos.y = 0;
    }
    if (newPos.x > stage.width() - box.width()) {
      newPos.x = stage.width() - box.width();
    }
    if (newPos.y > stage.height() - box.height()) {
      newPos.y = stage.height() - box.height();
    }
    if (newPos.x === 0 || newPos.y === 0) box.stopDrag();
    return newPos;
  });
  //
  /*
   * dblclick to remove box for desktop app
   * and dbltap to remove box for mobile app
   */
  box.on("dblclick dbltap", function () {
    this.destroy();
  });

  box.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  box.on("mouseout", function () {
    document.body.style.cursor = "default";
  });

  layer.add(box);
  stage.add(layer);
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
    <div class="">
      <div
        v-for="id in canvasIdArr"
        :key="id"
        :data-page="id"
        :id="id"
        class="canvas-container"
      >
        <!-- <canvas :id="id" class="canvas" /> -->
      </div>
    </div>
    <!-- <div class="tools">
      <button @click="shrinkCanvas">缩小</button>
      <button @click="enlargementCanvas">放大</button>
    </div> -->
  </section>
</template>
<style lang="scss" scoped>
.canvas {
  border: 1px solid rgb(109, 100, 88);
  margin-top: 20px;
}
</style>
<style>
.konvajs-content {
  border: 1px solid red;
  margin-top: 20px;
}
</style>
