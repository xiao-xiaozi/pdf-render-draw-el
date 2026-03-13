import Konva from 'konva'
import { nanoid } from 'nanoid'

export default function konvaStage (
  id,
  width,
  height,
  getScale,
  addDiagramCallback,
  removeDiagramCallback,
  updateAxis
) {
  const stage = new Konva.Stage({
    container: id,
    width,
    height
  })

  // This layer must stay at index 0 because the PDF canvas is mounted there.
  const layer = new Konva.Layer({})
  stage.add(layer)

  const diagramLayer = new Konva.Layer()
  stage.add(diagramLayer)

  const container = stage.container()
  container.addEventListener('dragover', function (e) {
    e.preventDefault()
  })

  container.addEventListener('drop', function (e) {
    const scale = getScale()
    const axis = {
      x: Math.floor(e.offsetX / scale),
      y: Math.floor((stage.height() - e.offsetY) / scale)
    }
    const id = nanoid(5)
    const diagram = addRectToCanvas(
      stage,
      id,
      axis,
      scale,
      removeDiagramCallback,
      updateAxis,
      getScale
    )
    const canvasId = stage.attrs.container.id.split('-')[2]
    addDiagramCallback({ id, axis, canvasId, diagram })
  })

  return stage
}

function addRectToCanvas (
  stage,
  id,
  axis,
  scale,
  removeDiagramCallback,
  updateAxis,
  getScale
) {
  let layer
  const layers = stage.getLayers()
  if (layers.length >= 2) {
    layer = layers[layers.length - 1]
  } else {
    layer = new Konva.Layer()
  }

  const baseWidth = 120
  const baseHeight = 120
  const diagram = new Konva.Rect({
    fill: 'orange',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true
  })

  diagram.baseAxis = { ...axis }
  diagram.baseSize = {
    width: baseWidth,
    height: baseHeight
  }

  applyScale(scale)

  diagram.on('dragstart', function () {
    this.moveToTop()
  })

  diagram.on('dragmove', function () {
    document.body.style.cursor = 'pointer'
  })

  diagram.dragBoundFunc(function (pos) {
    const newPos = {
      x: pos.x,
      y: pos.y
    }
    if (newPos.x < 0) {
      newPos.x = 0
    }
    if (newPos.y < 0) {
      newPos.y = 0
    }
    if (newPos.x > stage.width() - diagram.width()) {
      newPos.x = stage.width() - diagram.width()
    }
    if (newPos.y > stage.height() - diagram.height()) {
      newPos.y = stage.height() - diagram.height()
    }
    return newPos
  })

  diagram.on('dragend', function (params) {
    const { x, y } = params.target.attrs
    const currentScale = getScale()
    const centerX = x + diagram.width() / 2
    const centerY = y + diagram.height() / 2

    diagram.baseAxis.x = Math.floor(centerX / currentScale)
    diagram.baseAxis.y = Math.floor((stage.height() - centerY) / currentScale)

    updateAxis(
      id,
      diagram.baseAxis.x * currentScale,
      diagram.baseAxis.y * currentScale
    )
  })

  diagram.on('dblclick dbltap', function () {
    removeDiagramCallback(id)
    this.destroy()
  })

  diagram.on('mouseover', function () {
    document.body.style.cursor = 'pointer'
  })

  diagram.on('mouseout', function () {
    document.body.style.cursor = 'default'
  })

  layer.add(diagram)

  if (layers.length < 2) stage.add(layer)

  diagram.scaleFn = function (nextScale) {
    applyScale(nextScale)
    layer.batchDraw()
  }

  function applyScale (nextScale) {
    const scaledWidth = Math.floor(diagram.baseSize.width * nextScale)
    const scaledHeight = Math.floor(diagram.baseSize.height * nextScale)
    const x = Math.floor(diagram.baseAxis.x * nextScale - scaledWidth / 2)
    const y = Math.floor(
      stage.height() - diagram.baseAxis.y * nextScale - scaledHeight / 2
    )

    diagram.size({
      width: scaledWidth,
      height: scaledHeight
    })
    diagram.position({ x, y })
  }

  return diagram
}
