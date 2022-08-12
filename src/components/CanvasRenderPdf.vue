<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { getDocument } from "pdfjs-dist";
import konvaStage from "../utils/konva.js";
import { renderPDF } from "../utils/renderPDF.js";

onMounted(() => {
  initCanvasStage();
});

const canvasIdArray = reactive([]);
let canvasScale = ref(0.95);
let canvasWidth = ref(612);
let canvasHeight = ref(792);
let konvaStageArray = reactive([]);
let diagramArray = reactive([]); // 插入到canvas中的图形

let pdfPath = ref("/src/assets/UML.pdf");

function initCanvasStage() {
  // 根据输入数量，生成canvasId
  function generateCanvasId(num) {
    let count = 1;
    while (count <= num) {
      canvasIdArray.push(`canvas-page-${count}`);
      count++;
    }
  }

  // 根据canvasId数量，生成Konva Stage数量
  function generateKonvaStage(canvasIdArray) {
    canvasIdArray.forEach((id) => {
      konvaStageArray.push(
        konvaStage(
          id,
          canvasWidth.value,
          canvasHeight.value,
          addDiagram.bind(this),
          removeDiagram.bind(this),
          updateDiagramAxis
        )
      );
    });
  }

  // getDocument("/src/assets/UML.pdf").promise.then((pdf) => {
  getDocument(pdfPath.value).promise.then((pdf) => {
    if (!canvasIdArray.length) generateCanvasId(pdf.numPages); // 根据页数生成canvas id数量
    nextTick(() => {
      if (canvasIdArray.length && !konvaStageArray.length)
        generateKonvaStage(canvasIdArray); // 根据页数生成konva stage数量
      renderPDF(pdfPath.value, canvasScale.value, canvasIdArray);
    });
  });
}

// 添加图形
function addDiagram(diagram) {
  diagramArray.push(diagram);
  // console.log(diagramArray);
}

function removeDiagram(id) {
  let index = diagramArray.findIndex((el) => el.id === id);
  diagramArray.splice(index, 1);
  // console.log(diagramArray);
}

function updateDiagramAxis(id, x, y) {
  let diagram = diagramArray.find((el) => el.id === id);
  diagram.axis.x = x;
  diagram.axis.y = y;
}
</script>
<template>
  <section class="canvas-render-pdf">
    <!-- 可添加的元素 -->
    <div class="diagram-container">
      <div class="position-box">
        <div class="square" draggable="true"></div>
      </div>
    </div>
    <div class="canvas-container">
      <div
        v-for="id in canvasIdArray"
        :key="id"
        :data-page="id"
        :id="id"
        class=""
      ></div>
    </div>
    <!-- 元素的坐标，页数信息 -->
    <div class="diagram-coordinates">
      <div class="position-box">
        <!-- <button @click="initCanvasStage">渲染PDF</button> -->
        <section class="axis" v-if="diagramArray.length">
          <div class="diagram-attr">
            <div class="flex-1">页码</div>
            <div class="flex-1">X坐标</div>
            <div class="flex-1">Y坐标</div>
          </div>
          <div v-for="item in diagramArray" :key="item.id" class="diagram-attr">
            <div class="flex-1">{{ item.canvasId }}</div>
            <div class="flex-1">{{ item.axis.x }}</div>
            <div class="flex-1">{{ item.axis.y }}</div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.canvas-render-pdf {
  display: flex;
  .diagram-container,
  .diagram-coordinates {
    width: 400px;
    .position-box {
      position: fixed;
    }
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
  .diagram-coordinates {
    .axis {
      width: 300px;
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
    }
    .diagram-attr {
      height: 30px;
      line-height: 30px;
      text-align: center;
      display: flex;
      // justify-items: center;
      // align-items: center;
      .flex-1 {
        flex: 1;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
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
