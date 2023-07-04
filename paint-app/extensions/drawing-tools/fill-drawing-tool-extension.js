class FillDrawingToolExtension {
  constructor() {
    this.paintApp = null;
    this.drawingStart = this.drawingStart.bind(this);
    this.drawing = this.drawing.bind(this);
    this.drawingEnd = this.drawingEnd.bind(this);
    this.onDrawingToolChanged = this.onDrawingToolChanged.bind(this);
    this.active = false;
  }
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      "paintApp.drawingTool:changed",
      this.onDrawingToolChanged
    );
  }
  drawingStart({ x, y, ctx }) {
    if (!this.active) return;
    const startX = x;
    const startY = y;

    // Get the fill color
    const fillColor = this.paintApp.foregroundColor;
    // Perform flood fill
    this.floodFill(ctx, startX, startY, fillColor);
  }
  drawing(e) {
    // NOOP
  }
  drawingEnd(e) {
    // NOOP
  }
  unregisterDrawingEvents() {
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
      "url(./assets/toolbar-actions/fill/images/cursor-icon.png), auto"
    );
  }
  onDrawingToolChanged(toolName) {
    if (toolName === "fill") {
      this.active = true;
      this.registerDrawingEvents();
    } else if (this.active) {
      this.unregisterDrawingEvents();
    }
  }

  //
  floodFill(ctx, x, y, fillColor) {
    // Get the pixel data of the canvas
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const pixels = imageData.data;
    pixels.width = imageData.width;
    // Get the target color at the starting point
    const targetColor = this.getPixelColor(x, y, pixels);

    // If the target color is the same as the fill color, no need to fill
    if (this.colorsEqual(targetColor, fillColor)) {
      return;
    }

    // Perform flood fill using a stack-based approach
    const stack = [[x, y]];
    let freezehandler = 0;
    const maxCheckCount = Math.pow(ctx.canvas.width * ctx.canvas.height, 2);
    while (stack.length > 0 && freezehandler++ < maxCheckCount) {
      const [curX, curY] = stack.pop();

      // Check if the current pixel is within the canvas bounds
      if (
        curX < 0 ||
        curY < 0 ||
        curX >= ctx.canvas.width ||
        curY >= ctx.canvas.height
      ) {
        continue;
      }

      // Get the color of the current pixel
      const curColor = this.getPixelColor(curX, curY, pixels);

      // If the current pixel color is the same as the target color, fill it with the fill color
      if (this.colorsEqual(curColor, targetColor)) {
        this.setPixelColor(curX, curY, fillColor, pixels);

        // Add neighboring pixels to the stack for further processing
        stack.push([curX + 1, curY]);
        stack.push([curX - 1, curY]);
        stack.push([curX, curY + 1]);
        stack.push([curX, curY - 1]);
      }
    }

    // Update the canvas with the filled pixels
    ctx.putImageData(imageData, 0, 0);
  }

  getPixelColor(x, y, pixels) {
    const index = (y * pixels.width + x) * 4;
    return [
      pixels[index],
      pixels[index + 1],
      pixels[index + 2],
      pixels[index + 3],
    ];
  }

  setPixelColor(x, y, color, pixels) {
    const index = (y * pixels.width + x) * 4;
    pixels[index] = color[0];
    pixels[index + 1] = color[1];
    pixels[index + 2] = color[2];
    pixels[index + 3] = color[3];
  }

  colorsEqual(color1, color2) {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    );
  }

  //
}
