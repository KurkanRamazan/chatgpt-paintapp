// Get the canvas element
var canvas = document.getElementById("paintCanvas");
var ctx = canvas.getContext("2d");
var overlayCanvas = document.getElementById("overlay-canvas");
var overlayCtx = overlayCanvas.getContext("2d");

// Set the overlay canvas size to match the main canvas size
overlayCanvas.width = canvas.width;
overlayCanvas.height = canvas.height;

// Get the lineWidth select element
var lineWidthSelect = document.getElementById("lineWidth");

// Get the strokeColor input element
var strokeColorInput = document.getElementById("strokeColor");

// Get the scale indicator element
var scaleIndicator = document.getElementById("scaleIndicator");

// Get the zoomSlider element
var zoomSlider = document.getElementById("zoom-slider");

// Set initial drawing properties
var isDrawing = false;
var lineWidth = parseInt(lineWidthSelect.value);

// Set the initial stroke color
var strokeColor = strokeColorInput.value;

// Set the initial scale
var scale = 1;
var zoomFactor = 1.05;

// Event listeners for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", function (event) {
  updateSizeIndicatorPosition(event);
  updateMousePosition(event);
});

// Attach the change event listener to the lineWidth select element
lineWidthSelect.addEventListener("change", changeLineWidth);

// Attach the change event listener to the strokeColor input element
strokeColorInput.addEventListener("change", changeStrokeColor);

zoomSlider.addEventListener("input", handleZoomSlider);

// Function to start drawing
function startDrawing(event) {
  isDrawing = true;
  var { x, y } = calculateScaledCoordinates(event);
  ctx.beginPath();
  ctx.moveTo(x, y);

  if (toolbarActions[activeTool].drawStart) {
    toolbarActions[activeTool].drawStart(ctx, event);
  }
}

// Function to draw
function draw(event) {
  if (isDrawing) {
    if (toolbarActions[activeTool].draw)
      toolbarActions[activeTool].draw(ctx, event);
  }
}

// Function to stop drawing
function stopDrawing(event) {
  isDrawing = false;

  if (toolbarActions[activeTool].drawEnd) {
    toolbarActions[activeTool].drawEnd(ctx, event);
  }
}

// Function to handle line width change
function changeLineWidth(event) {
  lineWidth = parseInt(event.target.value);
}

// Function to handle stroke color change
function changeStrokeColor(event) {
  strokeColor = event.target.value;
}

// Clear the canvas with solid white color
function clearCanvas() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function updateSizeIndicatorPosition(event) {
  const x = event.clientX;
  const y = event.clientY;
  var sizeIndicator = document.getElementById("sizeIndicator");
  var indicatorSize = lineWidth * 1.6;
  sizeIndicator.style.left = x + "px";
  sizeIndicator.style.top = y + "px";
  sizeIndicator.style.width = indicatorSize + "px";
  sizeIndicator.style.height = indicatorSize + "px";
  sizeIndicator.style.marginLeft = -indicatorSize / 2 + "px";
  sizeIndicator.style.marginTop = -indicatorSize / 2 + "px";
}
function switchTab(tabId) {
  // Hide all tab contents
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  // Hide all tab buttons
  var tabButtons = document.getElementsByClassName("tabButton");
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Show the selected tab content
  document.getElementById(tabId).classList.add("active");

  // Show the selected tab button as active
  event.currentTarget.classList.add("active");
}
function redrawCanvas() {
  // Create an offscreen canvas to store the original content
  var originalCanvas = document.createElement("canvas");
  originalCanvas.width = canvas.width;
  originalCanvas.height = canvas.height;
  var originalCtx = originalCanvas.getContext("2d");

  // Store the original content on the offscreen canvas
  originalCtx.drawImage(canvas, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.drawImage(originalCanvas, 0, 0);
  ctx.restore();

  // Apply the scale to the line width
  var scaledLineWidth = lineWidth * scale;
  lineWidth = scaledLineWidth;
}
// Function to update the scale indicator
function updateScaleIndicator() {
  scaleIndicator.textContent = "Scale: " + scale.toFixed(2) + "x";
}
function calculateScaledCoordinates(event) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left - canvas.clientLeft;
  var mouseY = event.clientY - rect.top - canvas.clientTop;

  var scaledX = mouseX / scale;
  var scaledY = mouseY / scale;

  return { x: scaledX, y: scaledY };
}
function updateCanvasTransform() {
  canvas.style.transform = `scale(${scale})`;
  var marginTop = (canvas.offsetHeight * scale - canvas.offsetHeight) / 2;
  var marginLeft = (canvas.offsetWidth * scale - canvas.offsetWidth) / 2;
  canvas.style.marginTop = `${marginTop}px`;
  canvas.style.marginLeft = `${marginLeft}px`;
}
function updateOverlayCanvasTransform() {
  overlayCanvas.style.transform = `scale(${scale})`;
  var marginTop = (overlayCanvas.offsetHeight * scale - overlayCanvas.offsetHeight) / 2;
  var marginLeft = (overlayCanvas.offsetWidth * scale - overlayCanvas.offsetWidth) / 2;
  overlayCanvas.style.marginTop = `${marginTop}px`;
  overlayCanvas.style.marginLeft = `${marginLeft}px`;
}
function setScale(s) {
  scale = s;
  zoomSlider.value = s;
  updateCanvasTransform();
  updateOverlayCanvasTransform();
  updateScaleIndicator();
}
function updateMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;
  var scaledX = mouseX / scale;
  var scaledY = mouseY / scale;

  // Update the mouse position display
  var mousePosition = document.getElementById("mouse-position");
  mousePosition.textContent = `M: (${scaledX.toFixed(2)}, ${scaledY.toFixed(
    2
  )})`;
}
function updateCanvasSize() {
  var canvasSize = document.getElementById("canvas-size");
  canvasSize.textContent = `C: ${canvas.width}x${canvas.height}`;
}
function handleZoomSlider(event) {
  var newScale = parseFloat(event.target.value);
  setScale(newScale);
}
function showOverlayCanvas() {
  hideOverlayCanvas();
  overlayCanvas.classList.remove("active");
  overlayCanvas.classList.add("active");
  overlayCanvas.style.top = `${canvas.offsetTop}px`;
  overlayCanvas.style.left = `${canvas.offsetLeft}px`;
}
function hideOverlayCanvas() {
  overlayCanvas.classList.remove("active");
}
// Call the clearCanvas function to clear the canvas initially
clearCanvas();

activateTool("pen");
updateCanvasSize();
