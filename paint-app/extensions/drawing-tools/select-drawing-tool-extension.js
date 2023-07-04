class SelectDrawingToolExtension {
  constructor() {
    this.paintApp = null;
    this.active = false;
    this.selecting = false;
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
  drawingStart({ x, y, overlayCtx }) {
    this.startX = x;
    this.startY = y;
    this.selecting = true;
    this.clearOverlay({ overlayCtx });
    this.paintApp.fireEvent("drawingArea.selection:cleared");
  }
  drawing(e) {
    if (!this.active) return;
    this.drawGhost(e);
  }
  drawingEnd(e) {
    if (!this.selecting) return;
    this.selecting = false;
    this.paintApp.fireEvent(
      "drawingArea.selection:selected",
      this.selectedRect
    );
  }
  clearOverlay({ overlayCtx }) {
    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
  }
  drawGhost({ overlayCtx, x, y }) {
    var startX = this.startX;
    var startY = this.startY;
    var endX = x;
    var endY = y;
    if (startX > endX) {
      var t = startX;
      startX = endX;
      endX = t;
    }
    if (startY > endY) {
      var t = startY;
      startY = endY;
      endY = t;
    }

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
    overlayCtx.setLineDash([5, 5]); 
    overlayCtx.beginPath();
    overlayCtx.rect(startX, startY, endX - startX, endY - startY);
    overlayCtx.lineWidth = 1;
    overlayCtx.strokeStyle = "#000000";
    overlayCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
    overlayCtx.fill();
    overlayCtx.stroke();
    this.selectedRect = {
      x: startX,
      y: startY,
      width: endX - startX,
      height: endY - startY,
      endX,
      endY,
    };
  }
  unregisterDrawingEvents() {
    if (!this.active) return;
    this.active = false;
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
    this.paintApp.fireEvent("drawingArea.overlayCanvas:hide");
    this.paintApp.fireEvent("drawingArea.selection:cleared");
    this.paintApp.fireEvent("drawingArea.drawing:clearOverlay");
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
      "url(./assets/toolbar-actions/select/images/cursor-icon.png), auto"
    );
    this.paintApp.fireEvent("drawingArea.overlayCanvas:show");
  }
  onDrawingToolChanged(toolName) {
    this.unregisterDrawingEvents();
    if (toolName === "select") {
      this.active = true;
      this.registerDrawingEvents();
    }
  }
}
