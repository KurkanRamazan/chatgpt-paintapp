class PaintApp {
  constructor() {
    this.drawingTool = "pen";
    this.scale = 1;
    this.brushSize = 5;
    this.foregroundColor = "#000000";
    this.backgroundColor = "#ffffff";

    this.zoomFactor = 1.05;
    this.extensions = [];
    this.eventListeners = {};

    this.setDrawingTool = this.setDrawingTool.bind(this);
    this.setScale = this.setScale.bind(this);
    this.setBrushSize = this.setBrushSize.bind(this);
    this.setForegroundColor = this.setForegroundColor.bind(this);
    this.setBackgroundColor = this.setBackgroundColor.bind(this);

    this.addEventListener("paintApp.drawingTool:change", this.setDrawingTool);
    this.addEventListener("paintApp.scale:change", this.setScale);
    this.addEventListener("paintApp.brushSize:change", this.setBrushSize);
    this.addEventListener(
      "paintApp.foregroundColor:change",
      this.setForegroundColor
    );
    this.addEventListener(
      "paintApp.backgroundColor:change",
      this.setBackgroundColor
    );
  }

  init() {
    this.setDrawingTool(this.drawingTool);
    this.setScale(this.scale);
    this.setBrushSize(this.brushSize);
    this.setForegroundColor(this.foregroundColor);
    this.setBackgroundColor(this.backgroundColor);
  }

  setDrawingTool(toolName) {
    this.drawingTool = toolName;
    this.fireEvent("paintApp.drawingTool:changed", toolName);
  }

  setScale(value) {
    value = Math.max(Math.min(value, 50), 0.1) * 1.0;
    value = parseFloat(value.toFixed(2));
    this.scale = value;
    this.fireEvent("paintApp.scale:changed", value);
  }

  setBrushSize(value) {
    value = Math.max(Math.min(value, 500), 1);
    this.brushSize = parseInt(value);
    this.fireEvent("paintApp.brushSize:changed", value);
  }

  setForegroundColor(value) {
    this.foregroundColor = value;
    this.fireEvent("paintApp.foregroundColor:changed", value);
  }
  setBackgroundColor(value) {
    this.backgroundColor = value;
    this.fireEvent("paintApp.backgroundColor:changed", value);
  }
  zoomIn() {
    this.setScale(this.scale * this.zoomFactor);
  }
  zoomOut() {
    this.setScale(this.scale / this.zoomFactor);
  }
  zoomReset() {
    this.setScale(1);
  }

  addExtension(extension) {
    this.extensions.push(extension);
    extension.init(this);
  }

  removeExtension(extension) {
    const index = this.extensions.indexOf(extension);
    if (index !== -1) {
      this.extensions.splice(index, 1);
      extension.destroy(this);
    }
  }

  // Method to add event listeners to the PaintApp
  addEventListener(eventName, listener) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(listener);
  }

  // Method to remove event listeners from the PaintApp
  removeEventListener(eventName, listener) {
    const listeners = this.eventListeners[eventName];
    if (listeners) {
      this.eventListeners[eventName] = listeners.filter((l) => l !== listener);
    }
  }

  // Method to fire an event with optional data
  fireEvent(eventName, data) {
    const listeners = this.eventListeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(data);
      });
    }
  }
}
