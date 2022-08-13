import Konva from "konva";
import { nanoid } from "nanoid";

export default function konvaStage(
  id,
  width,
  height,
  addDiagramCallback,
  removeDiagramCallback,
  updateAxis
) {
  var stage = new Konva.Stage({
    container: id,
    width: width,
    height: height,
  });

  // 这层layer不能移除，渲染pdf时需要用到
  var layer = new Konva.Layer({
    // clearBeforeDraw: false,
  });
  stage.add(layer);

  // 图形绘制layout
  var diagramLayer = new Konva.Layer();
  stage.add(diagramLayer);

  let container = stage.container();
  container.addEventListener("dragover", function (e) {
    e.preventDefault(); // !important
  });

  container.addEventListener("drop", function (e) {
    // 元素坐标
    let axis = {
      x: e.offsetX,
      y: e.offsetY,
    };
    let id = nanoid(5);
    let diagram = addRectToCanvas(
      stage,
      id,
      axis,
      removeDiagramCallback,
      updateAxis
    );
    let canvasId = stage.attrs.container.id.split("-")[2]; // 通过canvasId知悉为第几个canvas
    addDiagramCallback({ id, axis, canvasId, diagram });
  });
  return stage;
}

// 往canvas中添加方形
function addRectToCanvas(stage, id, axis, removeDiagramCallback, updateAxis) {
  let layer;
  let layers = stage.getLayers();
  if (layers.length >= 2) {
    layer = layers[layers.length - 1];
  } else {
    layer = new Konva.Layer();
  }

  var diagram = new Konva.Rect({
    // react坐标点为左上角
    x: axis.x - 100 / 2,
    y: axis.y - 100 / 2,
    fill: "orange",
    stroke: "black",
    strokeWidth: 1,
    draggable: true,
    width: 120,
    height: 120,
  });
  diagram.on("dragstart", function () {
    this.moveToTop();
  });

  diagram.on("dragmove", function () {
    document.body.style.cursor = "pointer";
  });
  // 限制拖拽边界
  diagram.dragBoundFunc(function (pos) {
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
    if (newPos.x > stage.width() - diagram.width()) {
      newPos.x = stage.width() - diagram.width();
    }
    if (newPos.y > stage.height() - diagram.height()) {
      newPos.y = stage.height() - diagram.height();
    }
    return newPos;
  });
  diagram.on("dragend", function (params) {
    // 获取停止拖拽时元素的坐标, 以canvas左上角为原点，元素左上角的坐标
    let { x, y } = params.target.attrs;
    let { height } = layer.canvas; // canvas 高度
    let offsetOriginY = height - Math.floor(y);
    // updateAxis(id, x.toFixed(2), y.toFixed(2));
    updateAxis(
      id,
      Math.floor(x) + Math.floor(diagram.attrs.width / 2),
      Math.floor(offsetOriginY - diagram.attrs.width / 2)
    );
  });
  //
  /*
   * dblclick to remove diagram for desktop app
   * and dbltap to remove diagram for mobile app
   */
  diagram.on("dblclick dbltap", function () {
    removeDiagramCallback(id);
    this.destroy();
  });

  diagram.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  diagram.on("mouseout", function () {
    document.body.style.cursor = "default";
  });
  layer.add(diagram);

  if (layers.length < 2) stage.add(layer);

  diagram.scaleFn = diagramScaleFn();
  function diagramScaleFn() {
    let baseWidth = diagram.attrs.width;
    let baseHeight = diagram.attrs.height;
    return function (scale) {
      diagram.attrs.height = Math.floor(baseHeight * scale);
      diagram.attrs.width = Math.floor(baseWidth * scale);
      diagram.attrs.x = Math.floor(diagram.attrs.x * scale);
      diagram.attrs.y = Math.floor(diagram.attrs.y * scale);
    };
  }

  return diagram;
}

// 往canvas中添加圆形
function addCircleToCanvas(stage) {
  let layer;
  let layers = stage.getLayers();
  if (layers.length >= 2) {
    layer = layers[layers.length - 1];
  } else {
    layer = new Konva.Layer();
  }

  let diagram = new Konva.Circle({
    // 坐标点为圆心
    x: 1 * 30 + 5,
    y: 1 * 18 + 4,
    radius: 50,
    fill: "orange",
    draggable: true,
    width: 100,
    height: 100,
  });
  //
  diagram.on("dragstart", function () {
    this.moveToTop();
  });

  diagram.on("dragmove", function () {
    document.body.style.cursor = "pointer";
  });
  // 限制拖拽边界
  diagram.dragBoundFunc(function (pos) {
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
    if (newPos.x > stage.width() - diagram.width()) {
      newPos.x = stage.width() - diagram.width();
    }
    if (newPos.y > stage.height() - diagram.height()) {
      newPos.y = stage.height() - diagram.height();
    }
    return newPos;
  });
  diagram.on("dragend", function (params) {
    // 获取停止拖拽时元素的坐标
    let { x, y } = params.target.attrs; // 以canvas左上角为原点，元素左上角的坐标
    console.log(x, y);
  });
  //
  /*
   * dblclick to remove diagram for desktop app
   * and dbltap to remove diagram for mobile app
   */
  diagram.on("dblclick dbltap", function () {
    this.destroy();
  });

  diagram.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  diagram.on("mouseout", function () {
    document.body.style.cursor = "default";
  });
  layer.add(diagram);

  if (layers.length < 2) stage.add(layer);
}
