class DrawingAreaExtension {
  constructor(canvas, overlayCanvas) {
    this.canvas = canvas;
    this.overlayCanvas = overlayCanvas;
    this.ctx = canvas.getContext("2d");
    this.overlayCtx = overlayCanvas.getContext("2d");
    this.isDrawing = false;
    this.paintApp = null;

    this.startDrawing = this.startDrawing.bind(this);
    this.draw = this.draw.bind(this);
    this.stopDrawing = this.stopDrawing.bind(this);

    this.showOverlayCanvas = this.showOverlayCanvas.bind(this);
    this.hideOverlayCanvas = this.hideOverlayCanvas.bind(this);

    this.onPointerIconChange = this.onPointerIconChange.bind(this);

    this.onScaleChanged = this.onScaleChanged.bind(this);

    this.onDrawingClearSelected = this.onDrawingClearSelected.bind(this);
    this.onClearOverlayCanvas = this.onClearOverlayCanvas.bind(this);

    this.onSelectionCreateCopyRequested =
      this.onSelectionCreateCopyRequested.bind(this);

    this.canvas.addEventListener("mousedown", this.startDrawing);
    this.canvas.addEventListener("mousemove", this.draw);
    this.canvas.addEventListener("mouseup", this.stopDrawing);
    this.canvas.addEventListener("mouseout", this.stopDrawing);

    this.clearCanvas();
  }
  get scale() {
    return this.paintApp.scale;
  }
  // Method to initialize the extension
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      "drawingArea.overlayCanvas:show",
      this.showOverlayCanvas
    );
    this.paintApp.addEventListener(
      "drawingArea.overlayCanvas:hide",
      this.hideOverlayCanvas
    );
    this.paintApp.addEventListener(
      "drawingArea.pointerIcon:change",
      this.onPointerIconChange
    );
    this.paintApp.addEventListener(
      "paintApp.scale:changed",
      this.onScaleChanged
    );
    this.paintApp.addEventListener(
      "drawingArea.selection:createCopy",
      this.onSelectionCreateCopyRequested
    );
    paintApp.addEventListener(
      "drawingArea.selection:cleared",
      () => (this.selectedRect = undefined)
    );
    paintApp.addEventListener(
      "drawingArea.selection:selected",
      (rect) => (this.selectedRect = rect)
    );
    paintApp.addEventListener(
      "drawingArea.drawing:clearSelected",
      this.onDrawingClearSelected
    );
    paintApp.addEventListener(
      "drawingArea.drawing:clearOverlay",
      this.onClearOverlayCanvas
    );
  }

  startDrawing(event) {
    this.isDrawing = true;
    const { x, y } = this.calculateScaledCoordinates(event);
    this.paintApp.fireEvent("drawingArea.pointerPosition:changed", {
      x,
      y,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    this.paintApp.fireEvent("drawingArea.isDrawing:changed", this.isDrawing);
    this.paintApp.fireEvent("drawingArea:drawingStart", {
      ctx: this.ctx,
      overlayCtx: this.overlayCtx,
      x,
      y,
    });
  }

  draw(event) {
    const { x, y } = this.calculateScaledCoordinates(event);
    this.paintApp.fireEvent("drawingArea.pointerPosition:changed", {
      x,
      y,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    if (this.isDrawing) {
      this.paintApp.fireEvent("drawingArea:drawing", {
        ctx: this.ctx,
        overlayCtx: this.overlayCtx,
        x,
        y,
      });
    }
  }

  stopDrawing(event) {
    this.isDrawing = false;
    const { x, y } = this.calculateScaledCoordinates(event);
    this.paintApp.fireEvent("drawingArea.pointerPosition:changed", {
      x,
      y,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    this.paintApp.fireEvent("drawingArea.isDrawing:changed", this.isDrawing);
    this.paintApp.fireEvent("drawingArea:drawingEnd", {
      ctx: this.ctx,
      overlayCtx: this.overlayCtx,
      x,
      y,
    });
  }

  calculateScaledCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - this.canvas.clientLeft;
    const mouseY = event.clientY - rect.top - this.canvas.clientTop;

    const scaledX = mouseX / this.scale;
    const scaledY = mouseY / this.scale;

    return { x: scaledX, y: scaledY };
  }
  clearCanvas() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  updateCanvasTransform() {
    this.canvas.style.transform = `scale(${this.scale})`;
    var marginTop =
      (this.canvas.offsetHeight * this.scale - this.canvas.offsetHeight) / 2;
    var marginLeft =
      (this.canvas.offsetWidth * this.scale - this.canvas.offsetWidth) / 2;
    this.canvas.style.marginTop = `${marginTop}px`;
    this.canvas.style.marginLeft = `${marginLeft}px`;
  }
  updateOverlayCanvasTransform() {
    this.overlayCanvas.style.transform = `scale(${this.scale})`;
    var marginTop =
      (this.overlayCanvas.offsetHeight * this.scale -
        this.overlayCanvas.offsetHeight) /
      2;
    var marginLeft =
      (this.overlayCanvas.offsetWidth * this.scale -
        this.overlayCanvas.offsetWidth) /
      2;
    this.overlayCanvas.style.marginTop = `${marginTop}px`;
    this.overlayCanvas.style.marginLeft = `${marginLeft}px`;
  }
  showOverlayCanvas() {
    this.hideOverlayCanvas();
    this.overlayCanvas.classList.remove("active");
    this.overlayCanvas.classList.add("active");
  }
  hideOverlayCanvas() {
    this.overlayCanvas.classList.remove("active");
  }
  onPointerIconChange(icon) {
    if (icon) {
      this.canvas.style.cursor = icon;
    } else {
      this.canvas.style.cursor = "default";
    }
    this.paintApp.fireEvent("drawingArea.pointerIcon:changed", icon);
  }
  onScaleChanged() {
    this.updateCanvasTransform();
    this.updateOverlayCanvasTransform();
  }
  updateCanvasTransform() {
    const canvas = this.canvas;
    const scale = this.scale;
    canvas.style.transform = `scale(${scale})`;
    var marginTop = (canvas.offsetHeight * scale - canvas.offsetHeight) / 2;
    var marginLeft = (canvas.offsetWidth * scale - canvas.offsetWidth) / 2;
    canvas.style.marginTop = `${marginTop}px`;
    canvas.style.marginLeft = `${marginLeft}px`;
  }

  updateOverlayCanvasTransform() {
    const canvas = this.canvas;
    const overlayCanvas = this.overlayCanvas;
    const scale = this.scale;
    overlayCanvas.style.transform = `scale(${scale})`;
    var marginTop = (canvas.offsetHeight * scale - canvas.offsetHeight) / 2;
    var marginLeft = (canvas.offsetWidth * scale - canvas.offsetWidth) / 2;
    overlayCanvas.style.marginTop = `${marginTop}px`;
    overlayCanvas.style.marginLeft = `${marginLeft}px`;
  }
  onSelectionCreateCopyRequested(callback) {
    if (!this.selectedRect) return callback(undefined);
    // Get the selected area coordinates
    var { x, y, width, height } = this.selectedRect; //this.getSelectedArea();

    // Create a temporary canvas and context to hold the selected area
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");

    // Set the dimensions of the temporary canvas
    tempCanvas.width = width;
    tempCanvas.height = height;
    // Copy the selected area from the main canvas to the temporary canvas
    tempCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
    callback(tempCanvas);
  }
  onDrawingClearSelected() {
    if (!this.selectedRect) return;
    this.ctx.beginPath();
    this.ctx.rect(
      this.selectedRect.x,
      this.selectedRect.y,
      this.selectedRect.width,
      this.selectedRect.height
    );
    this.ctx.fillStyle = this.paintApp.backgroundColor;
    this.ctx.fill();
  }
  onClearOverlayCanvas() {
    this.overlayCtx.clearRect(
      0,
      0,
      this.overlayCtx.canvas.width,
      this.overlayCtx.canvas.height
    );
  }
}
