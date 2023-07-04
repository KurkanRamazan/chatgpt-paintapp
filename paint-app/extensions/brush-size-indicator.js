class BrushSizeIndicatorExtension {
  constructor(el) {
    this.el = el;
    this.paintApp = null;
    this.brushSize = 1;
    this.onBrushSizeChanged = this.onBrushSizeChanged.bind(this);
    this.onPointerPositionChanged = this.onPointerPositionChanged.bind(this);
  }
  get scale() {
    return this.paintApp.scale;
  }
  get indicatorSize() {
    return this.brushSize * this.scale * 1.6;
  }
  init(paintApp) {
    this.paintApp = paintApp;
    paintApp.addEventListener(
      "drawingArea.pointerPosition:changed",
      this.onPointerPositionChanged
    );
    paintApp.addEventListener(
      "paintApp.brushSize:changed",
      this.onBrushSizeChanged
    );
  }
  onBrushSizeChanged(value) {
    this.brushSize = value;
    this.refreshIndicatorSize();
  }

  refreshIndicatorSize() {
    this.el.style.width = this.indicatorSize + "px";
    this.el.style.height = this.indicatorSize + "px";
  }
  onPointerPositionChanged({ clientX, clientY }) {
    var indicatorSize = this.indicatorSize;
    this.refreshIndicatorSize();
    this.el.style.left = clientX + "px";
    this.el.style.top = clientY + "px";
    this.el.style.marginLeft = -indicatorSize / 2 + "px";
    this.el.style.marginTop = -indicatorSize / 2 + "px";
  }
}
