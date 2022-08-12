import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/src/assets/pdf.worker.js";
// 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js'



export function renderPDF(pdfPath,canvasScale, canvasIds) {
  if (!canvasIds.length)
    throw new Error("Please run initCanvasStage first");
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
          var scale = canvasScale;
          var viewport = page.getViewport({ scale: scale });
          var outputScale = window.devicePixelRatio || 1;
          var canvas = findCanvasNode(canvasIds[currentPage - 1]);
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
