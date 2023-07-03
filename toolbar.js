// Find all toolbar buttons with the "toolbar-command" class
var toolbarButtons = document.querySelectorAll(".toolbar-command");

// Loop through each toolbar button and attach the click event listener
toolbarButtons.forEach(function (button) {
  button.addEventListener("click", selectTool);
});

// Function to handle tool selection
function selectTool(event) {
  // Remove active class from all buttons
  toolbarButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  // Add active class to the clicked button
  event.target.classList.add("active");

  // Get the selected tool from the data-tool attribute
  var selectedTool = event.target.getAttribute("data-tool");
  activateTool(selectedTool);
}
function activateTool(selectedTool) {
  // Update the activeTool variable
  activeTool = selectedTool;

  // Set the cursor image for the selected tool
  var cursorImage = toolbarActions[activeTool].cursorImage;
  if (cursorImage) {
    canvas.style.cursor = `url(${cursorImage}), auto`;
  } else {
    canvas.style.cursor = "default";
  }
}
// Dictionary to map toolbar buttons to actions
var toolbarActions = {
  pen: {
    draw: function (ctx, event) {
      ctx.lineTo(
        event.clientX - ctx.canvas.offsetLeft,
        event.clientY - ctx.canvas.offsetTop
      );
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeColor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    },
    cursorImage: "./assets/toolbar-actions/pen/images/cursor-icon.png",
  },
  eraser: {
    draw: function (ctx, event) {
      ctx.clearRect(
        event.clientX - ctx.canvas.offsetLeft - lineWidth / 2,
        event.clientY - ctx.canvas.offsetTop - lineWidth / 2,
        lineWidth,
        lineWidth
      );
    },
    cursorImage: "./assets/toolbar-actions/eraser/images/cursor-icon.png",
  },
  shapes: {
    draw: function (ctx, event) {
      console.log("Shapes selected");
      // Add code for shape tool action
    },
    cursorImage: null,
  },
  fill: {
    draw: function (ctx, event) {
      // NOOP
    },
    drawStart: function (ctx, event) {
      var imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      var pixelData = imageData.data;

      // Get the starting point for flood fill
      var startX = event.clientX - ctx.canvas.offsetLeft;
      var startY = event.clientY - ctx.canvas.offsetTop;
      var startPixel = (startY * ctx.canvas.width + startX) * 4;
      var startColor = [
        pixelData[startPixel],
        pixelData[startPixel + 1],
        pixelData[startPixel + 2],
      ];

      // Queue for flood fill
      var queue = [[startX, startY]];

      // Check if a pixel is within the canvas boundaries
      function isPixelWithinBounds(x, y) {
        return (
          x >= 0 && y >= 0 && x < ctx.canvas.width && y < ctx.canvas.height
        );
      }

      // Check if a pixel has the same color as the starting point
      function isSameColor(x, y) {
        var pixel = (y * ctx.canvas.width + x) * 4;
        var color = [
          pixelData[pixel],
          pixelData[pixel + 1],
          pixelData[pixel + 2],
        ];
        return (
          color[0] === startColor[0] &&
          color[1] === startColor[1] &&
          color[2] === startColor[2]
        );
      }

      // Flood fill algorithm with an upper bound
      var count = 0; // Track the number of filled pixels
      var maxCount = Math.pow(ctx.canvas.width * ctx.canvas.height, 2); // Set the maximum number of filled pixels

      // Flood fill algorithm
      while (queue.length > 0 && count < maxCount) {
        count++;
        var [x, y] = queue.pop();

        if (isPixelWithinBounds(x, y) && isSameColor(x, y)) {
          var pixel = (y * ctx.canvas.width + x) * 4;
          pixelData[pixel] = parseInt(strokeColor.substring(1, 3), 16); // Red
          pixelData[pixel + 1] = parseInt(strokeColor.substring(3, 5), 16); // Green
          pixelData[pixel + 2] = parseInt(strokeColor.substring(5, 7), 16); // Blue

          // Add adjacent pixels to the queue
          queue.push([x + 1, y]);
          queue.push([x - 1, y]);
          queue.push([x, y + 1]);
          queue.push([x, y - 1]);
        }
      }

      // Put the updated pixel data back onto the canvas
      ctx.putImageData(imageData, 0, 0);
    },

    cursorImage: "./assets/toolbar-actions/fill/images/cursor-icon.png",
  },
};

// Initialize the active tool as "pen"
var activeTool = "pen";
