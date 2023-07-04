// Get the canvas element
var canvas = document.getElementById("paintCanvas");
var overlayCanvas = document.getElementById("overlay-canvas");
var toolbarContainer = document.getElementById("toolbar-container");
var bushSizeIndicator = document.getElementById("bush-size-indicator");
var extensions = [
  new ToolbarExtension(toolbarContainer),
  new DrawingAreaExtension(canvas, overlayCanvas),
  new PenDrawingToolExtension(),
  new EraserDrawingToolExtension(),
  new SelectDrawingToolExtension(),
  new FillDrawingToolExtension(),
  new BrushSizeIndicatorExtension(bushSizeIndicator),
  new UIValueBinderExtension(
    document.getElementById("foregroundColor"),
    "paintApp.foregroundColor:change",
    "paintApp.foregroundColor:changed"
  ),
  new UIValueBinderExtension(
    document.getElementById("backgroundColor"),
    "paintApp.backgroundColor:change",
    "paintApp.backgroundColor:changed"
  ),
  new UIValueBinderExtension(
    document.getElementById("brushSize"),
    "paintApp.brushSize:change",
    "paintApp.brushSize:changed"
  ),
  //
  new UIValueViewerExtension(
    document.getElementById("mouse-position"),
    "drawingArea.pointerPosition:changed",
    ({ x, y }) => `M:${parseInt(x)}x${parseInt(y)}`
  ),
  new UIValueBinderExtension(
    document.getElementById("zoom-slider"),
    "paintApp.scale:change",
    "paintApp.scale:changed"
  ),
  //
  new ZoomInButtonExtension(document.getElementById("zoomIn")),
  new ZoomOutButtonExtension(document.getElementById("zoomOut")),
  new ZoomResetButtonExtension(document.getElementById("zoomReset")),
  new UIValueViewerExtension(
    document.getElementById("scaleIndicator"),
    "paintApp.scale:changed",
    (s) => `Z:${s}x`
  ),
  //
  new CopySelectionButtonExtension(document.getElementById("copyButton")),
  new CutSelectionButtonExtension(document.getElementById("cutButton")),
  //
  new UndoButtonExtension(document.getElementById("undoButton")),
  new RedoButtonExtension(document.getElementById("redoButton")),
  //
  new UndoRedoManager(),
];

var paintApp = new PaintApp();
extensions.forEach((extension) => {
  paintApp.addExtension(extension);
});
paintApp.init();
