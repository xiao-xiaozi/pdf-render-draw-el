import Konva from "konva";

export default function konvaStage(id, width, height) {
  // var width = window.innerWidth;
  // var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: id,
    width: width,
    height: height,
  });

  var layer = new Konva.Layer();

  // var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

  // for (var i = 0; i < 6; i++) {
  //   var box = new Konva.Rect({
  //     x: i * 30 + 50,
  //     y: i * 18 + 40,
  //     fill: colors[i],
  //     stroke: "black",
  //     strokeWidth: 4,
  //     draggable: true,
  //     width: 100,
  //     height: 50,
  //   });

  //   box.on("dragstart", function () {
  //     this.moveToTop();
  //   });

  //   box.on("dragmove", function () {
  //     document.body.style.cursor = "pointer";
  //   });
  //   /*
  //    * dblclick to remove box for desktop app
  //    * and dbltap to remove box for mobile app
  //    */
  //   box.on("dblclick dbltap", function () {
  //     this.destroy();
  //   });

  //   box.on("mouseover", function () {
  //     document.body.style.cursor = "pointer";
  //   });
  //   box.on("mouseout", function () {
  //     document.body.style.cursor = "default";
  //   });

  //   layer.add(box);
  // }

  // add the layer to the stage
  stage.add(layer);
  return stage;
}
