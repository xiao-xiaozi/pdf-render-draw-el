import { getDocument } from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.mjs'

export function renderPDF (pdfPath, canvasIds, canvasWidth, canvasHeight) {
  if (!canvasIds.length) throw new Error('Please run initCanvasStage first')
  // 找到canvas节点
  function findCanvasNode (id) {
    const node = document.getElementById(id)
    const childNodes = node.childNodes
    const descendantNodes = childNodes[0].childNodes
    return descendantNodes[0]
  }
  getDocument(pdfPath).promise.then((pdf) => {
    const pageNumber = pdf.numPages
    let currentPage = 1
    while (currentPage <= pageNumber) {
      (function (currentPage) {
        pdf.getPage(currentPage).then((page) => {
          const viewport = page.getViewport({ scale: 1 })
          const scaleWidth = canvasWidth / viewport.width
          const scaleHeight = canvasHeight / viewport.height
          const scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight
          // let scale = scaleHeight > scaleWidth ? scaleHeight : scaleWidth;
          const scaleViewport = page.getViewport({ scale })
          const outputScale = window.devicePixelRatio || 1
          const canvas = findCanvasNode(canvasIds[currentPage - 1])
          // var context = canvas.getContext("2d");
          const context = canvas.getContext('2d', { willReadFrequently: true })
          // 水平位置
          // var transform = [1.1, 0, 0, 1.1, 0, 0]
          const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

          const renderContext = {
            canvasContext: context,
            transform,
            // viewport: viewport,
            viewport: scaleViewport
          }
          page.render(renderContext)
        })
      })(currentPage)

      currentPage++
    }
  })
}
