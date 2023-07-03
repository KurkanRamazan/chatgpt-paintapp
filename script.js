// Get the canvas element
var canvas = document.getElementById("paintCanvas");
var ctx = canvas.getContext("2d");

// Set initial drawing properties
var isDrawing = false;
var lineWidth = 5;
var strokeColor = "#000000";

// Event listeners for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

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
activateTool("pen");
