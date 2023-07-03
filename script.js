// Get the canvas element
var canvas = document.getElementById("paintCanvas");
var ctx = canvas.getContext("2d");

// Get the lineWidth select element
var lineWidthSelect = document.getElementById("lineWidth");

// Set initial drawing properties
var isDrawing = false;
var lineWidth = parseInt(lineWidthSelect.value);
var strokeColor = "#000000";

// Event listeners for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Attach the change event listener to the lineWidth select element
lineWidthSelect.addEventListener("change", changeLineWidth);

// Function to start drawing
function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
}

// Function to draw
function draw(event) {
  if (isDrawing) {
    toolbarActions[activeTool].draw(ctx, event);
  }
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
}

// Function to handle line width change
function changeLineWidth(event) {
  lineWidth = parseInt(event.target.value);
}
activateTool("pen");
