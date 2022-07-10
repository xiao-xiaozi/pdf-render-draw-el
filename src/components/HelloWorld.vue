<script setup>
import { onMounted } from "vue";
// import pdfjsLib from "pdfjs-dist";
import Konva from "konva";

onMounted(() => {
  konvaStage();
  findNode();
});

function konvaStage() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
    id: "the-canvas",
  });

  var layer = new Konva.Layer();

  var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

  for (var i = 0; i < 6; i++) {
    var box = new Konva.Rect({
      x: i * 30 + 50,
      y: i * 18 + 40,
      fill: colors[i],
      stroke: "black",
      strokeWidth: 4,
      draggable: true,
      width: 100,
      height: 50,
    });

    box.on("dragstart", function () {
      this.moveToTop();
    });

    box.on("dragmove", function () {
      document.body.style.cursor = "pointer";
    });
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
  }

  // add the layer to the stage
  stage.add(layer);
}

function findNode(id) {
  let node = document.getElementById(id);
  let childNodes = node.childNodes;
  let descendantNodes = childNodes[0].childNodes;
  console.log(descendantNodes[0]);
}
</script>

<template>
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
