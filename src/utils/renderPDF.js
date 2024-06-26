import { getDocument } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs"


export function renderPDF(pdfPath, canvasIds, canvasWidth, canvasHeight) {
  if (!canvasIds.length) throw new Error("Please run initCanvasStage first");
  // 找到canvas节点
  function findCanvasNode(id) {
    let node = document.getElementById(id);
    let childNodes = node.childNodes;
    let descendantNodes = childNodes[0].childNodes;
    return descendantNodes[0];
  }
  getDocument(pdfPath).promise.then((pdf) => {
    let pageNumber = pdf.numPages;
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      (function (currentPage) {
        pdf.getPage(currentPage).then((page) => {
          var viewport = page.getViewport({ scale: 1 });
          let scaleWidth = canvasWidth / viewport.width;
          let scaleHeight = canvasHeight / viewport.height;
          let scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;
          // let scale = scaleHeight > scaleWidth ? scaleHeight : scaleWidth;
          let scaleViewport = page.getViewport({ scale: scale });
          var outputScale = window.devicePixelRatio || 1;
          var canvas = findCanvasNode(canvasIds[currentPage - 1]);
          // var context = canvas.getContext("2d");
          var context = canvas.getContext("2d", { willReadFrequently: true });
          // 水平位置
          // var transform = [1.1, 0, 0, 1.1, 0, 0]
          let transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

          var renderContext = {
            canvasContext: context,
            transform: transform,
            // viewport: viewport,
            viewport: scaleViewport,
          };
          page.render(renderContext);
        });
      })(currentPage);

      currentPage++;
    }
  });
}
