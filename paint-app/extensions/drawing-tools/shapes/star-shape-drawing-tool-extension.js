class StarShapeDrawingToolExtension {
  constructor(radius, points) {
    this.paintApp = null;
    this.active = false;
    this.isDrawing = false;
    this.points = points;
    this.radius = radius;
    this.drawingStart = this.drawingStart.bind(this);
    this.drawing = this.drawing.bind(this);
    this.drawingEnd = this.drawingEnd.bind(this);
    this.onDrawingToolChanged = this.onDrawingToolChanged.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      "paintApp.drawingTool:changed",
      this.onDrawingToolChanged
    );
  }
  drawingStart(e) {
    if (!this.active) return;
    this.isDrawing = true;
    this.drawStar(e);
    document.addEventListener("wheel", this.handleScroll);
  }
  drawing(e) {
    if (!this.active) return;
    if (!this.isDrawing) return;
    this.drawStar(e);
  }
  drawingEnd(e) {
    if (!this.active) return;
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.paintApp.fireEvent("drawingArea.undoredo:start");
    this.drawStar(e, true);
    this.paintApp.fireEvent("drawingArea.undoredo:end");
    this.clearOverlay(e.overlayCtx);
  }

  handleScroll(event) {
    // Determine the scroll direction
    const scrollDirection = event.deltaY > 0 ? "down" : "up";

    // Perform actions based on the scroll direction
    if (scrollDirection === "down") {
      this.radius -= 1;
      if (this.radius < 1) this.radius = 1;
    } else {
      this.radius += 1;
    }
    this.paintApp.fireEvent("drawingArea.drawing:redraw", event);
  }
  clearOverlay(overlayCtx) {
    overlayCtx.clearRect(
      0,
      0,
      overlayCtx.canvas.width,
      overlayCtx.canvas.height
    );
  }
  drawStar({ x, y, ctx, overlayCtx }, apply) {
    const targetCtx = apply ? ctx : overlayCtx;
    if (!apply) this.clearOverlay(overlayCtx);

    const { radius, points } = this;
    targetCtx.lineWidth = this.paintApp.brushSize;
    targetCtx.strokeStyle = this.paintApp.foregroundColor;
    targetCtx.lineCap = "butt";
    targetCtx.lineJoin = "miter";
    targetCtx.beginPath();
    for (let i = 0; i <= points * 2; i++) {
      const angle = ((Math.PI * 2) / (points * 2)) * i;
      const innerRadius = i % 2 === 0 ? radius * 0.5 : radius;
      const cx = x + Math.cos(angle) * innerRadius;
      const cy = y + Math.sin(angle) * innerRadius;

      if (i === 0) {
        targetCtx.moveTo(cx, cy);
      } else {
        targetCtx.lineTo(cx, cy);
      }
    }
    targetCtx.closePath();
    targetCtx.stroke();
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
      "url(./assets/toolbar-actions/pen/images/cursor-icon.png), auto"
    );
    this.paintApp.fireEvent("drawingArea.overlayCanvas:show");
  }
  onDrawingToolChanged(toolName) {
    if (toolName === "starshape-" + this.points) {
      this.active = true;
      this.registerDrawingEvents();
    } else if (this.active) {
      this.unregisterDrawingEvents();
    }
  }
}
