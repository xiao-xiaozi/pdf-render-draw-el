<script setup>
import { ref, onMounted } from "vue";
// import pdfjsLib from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import Konva from "konva";

defineProps({
  msg: String,
});

GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js";
// console.log(workerSrc);
// GlobalWorkerOptions.workerSrc = workerSrc;

onMounted(() => {
  renderPDF();
  setTimeout(() => {
    drapRect();
    konvaFn();
  }, 3000);
});

function drapRect() {
  const canvas = document.getElementById("the-canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "green";
  ctx.strokeRect(0, 0, 100, 100);
}

function renderPDF() {
  getDocument("/src/assets/UML.pdf")
    .promise.then(function (pdf) {
      pdf.getPage(1).then((page) => {
        var scale = 1.5;
        var viewport = page.getViewport({ scale: scale });
        var outputScale = window.devicePixelRatio || 1;

        var canvas = document.getElementById("the-canvas");
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
    })
    .catch((error) => {
      console.log(error);
    });
}

function mousemoveHandle(e) {
  console.log(e);
  const canvas = document.getElementById("the-canvas");
  console.log(canvas.getBoundingClientRect());
}

function konvaFn() {
  var stage = new Konva.Stage({
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // add canvas element
  var layer = new Konva.Layer();
  stage.add(layer);

  // create shape
  var box = new Konva.Rect({
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    fill: "#00D2FF",
    stroke: "black",
    strokeWidth: 4,
    draggable: true,
  });
  layer.add(box);

  // add cursor styling
  box.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  box.on("mouseout", function () {
    document.body.style.cursor = "default";
  });
}
</script>

<template>
  <canvas id="the-canvas" @mousedown="mousemoveHandle"></canvas>
  <div id="container"></div>
</template>

<style scoped>
a {
  color: #42b983;
}

#the-canvas {
  border: 1px solid blue;
}
</style>
