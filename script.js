// Get the canvas element
var canvas = document.getElementById("paintCanvas");
var ctx = canvas.getContext("2d");

// Get the lineWidth select element
var lineWidthSelect = document.getElementById("lineWidth");

// Get the strokeColor input element
var strokeColorInput = document.getElementById("strokeColor");

// Set initial drawing properties
var isDrawing = false;
var lineWidth = parseInt(lineWidthSelect.value);

// Set the initial stroke color
var strokeColor = strokeColorInput.value;

// Event listeners for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Attach the change event listener to the lineWidth select element
lineWidthSelect.addEventListener("change", changeLineWidth);

// Attach the change event listener to the strokeColor input element
strokeColorInput.addEventListener("change", changeStrokeColor);

// Function to start drawing
function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );

  if (toolbarActions[activeTool].drawStart) {
    toolbarActions[activeTool].drawStart(ctx, event);
  }
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

// Function to handle stroke color change
function changeStrokeColor(event) {
  strokeColor = event.target.value;
}

// Clear the canvas with solid white color
function clearCanvas() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Call the clearCanvas function to clear the canvas initially
clearCanvas();

activateTool("pen");
