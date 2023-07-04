class PenDrawingToolExtension {
  constructor() {
    this.paintApp = null;
    this.active = false;
    this.isDrawing = false;
    this.drawingStart = this.drawingStart.bind(this);
    this.drawing = this.drawing.bind(this);
    this.drawingEnd = this.drawingEnd.bind(this);
    this.onDrawingToolChanged = this.onDrawingToolChanged.bind(this);
  }
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      "paintApp.drawingTool:changed",
      this.onDrawingToolChanged
    );
  }
  drawingStart({ ctx, x, y }) {
    if (!this.active) return;
    this.isDrawing = true;
    this.paintApp.fireEvent("drawingArea.undoredo:start");
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  drawing({ ctx, x, y }) {
    if (!this.active) return;
    if (!this.isDrawing) return;
    ctx.lineTo(x, y);
    ctx.lineWidth = this.paintApp.brushSize;
    ctx.strokeStyle = this.paintApp.foregroundColor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  drawingEnd({ ctx, x, y }) {
    if (!this.active) return;
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.paintApp.fireEvent("drawingArea.undoredo:end");
  }
  unregisterDrawingEvents() {
    this.active = false;
    this.isDrawing = false;
    this.paintApp.fireEvent("drawingArea.pointerIcon:change");
    this.paintApp.removeEventListener(
      "drawingArea:drawingStart",
      this.drawingStart
    );
    this.paintApp.removeEventListener("drawingArea:drawing", this.drawing);
    this.paintApp.removeEventListener(
      "drawingArea:drawingEnd",
      this.drawingEnd
    );
  }
  registerDrawingEvents() {
    this.paintApp.addEventListener(
      "drawingArea:drawingStart",
      this.drawingStart
    );
    this.paintApp.addEventListener("drawingArea:drawing", this.drawing);
    this.paintApp.addEventListener("drawingArea:drawingEnd", this.drawingEnd);
    this.paintApp.fireEvent(
      "drawingArea.pointerIcon:change",
      "url(./assets/toolbar-actions/pen/images/cursor-icon.png), auto"
    );
  }
  onDrawingToolChanged(toolName) {
    if (toolName === "pen") {
      this.active = true;
      this.registerDrawingEvents();
    } else if (this.active) {
      this.unregisterDrawingEvents();
    }
  }
}
