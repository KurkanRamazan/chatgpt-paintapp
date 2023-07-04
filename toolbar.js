// Find all toolbar buttons with the "toolbar-command" class
var toolbarButtons = document.querySelectorAll(".toolbar-command");

// Loop through each toolbar button and attach the click event listener
toolbarButtons.forEach(function (button) {
  button.addEventListener("click", selectTool);
});

// Function to handle tool selection
function selectTool(event) {
  // Get the selected tool from the data-tool attribute
  var selectedTool = event.target.getAttribute("data-tool");

  // Check if the selected tool has a command function
  if (typeof toolbarActions[selectedTool].command === "function") {
    // Call the command function for the selected tool
    toolbarActions[selectedTool].command();
    return; // Stop executing the rest of the function
  }
  // Remove active class from all buttons
  toolbarButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  // Add active class to the clicked button
  event.target.classList.add("active");
  activateTool(selectedTool);
}
function activateTool(selectedTool) {
  var oldTool = toolbarActions[activeTool];
  if (oldTool.beforeChange) oldTool.beforeChange();
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
      var { x, y } = calculateScaledCoordinates(event);
      ctx.lineTo(x, y);
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
      var { x, y } = calculateScaledCoordinates(event);
      ctx.lineTo(x, y);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeColor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    },
    drawStart() {
      this.oldColor = strokeColor;
      strokeColor = "#ffffff";
    },
    beforeChange() {
      strokeColor = this.oldColor;
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
      var { x, y } = calculateScaledCoordinates(event);

      var imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      var pixelData = imageData.data;

      // Get the starting point for flood fill
      var startX = x;
      var startY = y;
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
  zoomIn: {
    command: function () {
      setScale(scale * zoomFactor);
    },
  },

  zoomOut: {
    command: function () {
      // Decrease the scale by the zoom factor
      setScale(scale / zoomFactor);
    },
  },
  zoomReset: {
    command: function () {
      setScale(1);
    },
  },

  select: {
    drawStart: function (ctx, event) {
      showOverlayCanvas();
      var { x, y } = calculateScaledCoordinates(event);
      this.startX = x;
      this.startY = y;
      this.selecting = true;
      showClipboardActivateElements(); // Call the function to show elements with data-clipboard-activate attribute
    },
    drawEnd: function (ctx, event) {
      if (!this.selecting) return;
      this.selecting = false;
      this.drawGhost(overlayCtx, event);
    },
    draw: function (ctx, event) {
      this.drawGhost(overlayCtx, event);
    },
    drawGhost: function (ctx, event) {
      var { x, y } = calculateScaledCoordinates(event);
      var startX = this.startX;
      var startY = this.startY;
      var endX = x;
      var endY = y;
      if (startX > endX) {
        var t = startX;
        startX = endX;
        endX = t;
      }
      if (startY > endY) {
        var t = startY;
        startY = endY;
        endY = t;
      }

      ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      ctx.beginPath();
      ctx.rect(startX, startY, endX - startX, endY - startY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();
      ctx.stroke();
      this.selectedRect = {
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
        endX,
        endY,
      };
    },
    beforeChange() {
      hideOverlayCanvas();
      this.selectedRect = false;
      this.selecting = false;
      hideClipboardActivateElements(); // Call the function to hide elements with data-clipboard-activate attribute
    },
    cursorImage: "./assets/toolbar-actions/select/images/cursor-icon.png",
  },
  copy: {
    command() {
      if (!toolbarActions.select.selectedRect) return;
      return this.copyAsImage();
    },
    getCopyCanvas() {
      if (!toolbarActions.select.selectedRect) return;
      // Get the selected area coordinates
      var { x, y, width, height } = toolbarActions.select.selectedRect; //this.getSelectedArea();

      // Create a temporary canvas and context to hold the selected area
      var tempCanvas = document.createElement("canvas");
      var tempCtx = tempCanvas.getContext("2d");

      // Set the dimensions of the temporary canvas
      tempCanvas.width = width;
      tempCanvas.height = height;
      // Copy the selected area from the main canvas to the temporary canvas
      tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
      return tempCanvas;
    },
    copyAsText() {
      var tempCanvas = this.getCopyCanvas();
      if (!tempCanvas) return;

      // Convert the selected area on the temporary canvas to a data URL
      var dataURL = tempCanvas.toDataURL();

      // Copy the data URL to the clipboard
      return navigator.clipboard
        .writeText(dataURL)
        .then(function () {
          console.log("Selected area copied to clipboard.");
        })
        .catch(function (error) {
          console.error("Failed to copy selected area to clipboard:", error);
          alert(error);
        });
    },
    copyAsImage() {
      var tempCanvas = this.getCopyCanvas();
      if (!tempCanvas) return;

      return new Promise((pres, prej) => {
        //tested on chrome 76
        tempCanvas.toBlob(function (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard
            .write([item])
            .then(function () {
              console.log("Selected area copied to clipboard.");
              pres();
            })
            .catch(function (error) {
              console.error(
                "Failed to copy selected area to clipboard:",
                error
              );
              alert(error);
              prej(error);
            });
        });
      });
    },
    getSelectedArea() {
      var rect = overlayCanvas.getBoundingClientRect();
      var selectionRect = toolbarActions.select.selectedRect;
      var startX = (selectionRect.x - rect.left) / scale;
      var startY = (selectionRect.y - rect.top) / scale;
      var endX = (selectionRect.endX - rect.left) / scale;
      var endY = (selectionRect.endY - rect.top) / scale;
      var width = endX - startX;
      var height = endY - startY;

      return { x: startX, y: startY, width: width, height: height };
    },
  },
  cut: {
    async command() {
      var { x, y, width, height } = toolbarActions.select.selectedRect; //this.getSelectedArea();
      try {
        await toolbarActions.copy.command();
        ctx.clearRect(x, y, width, height);
        toolbarActions.select.beforeChange();
      } catch (error) {}
    },
  },
};

// Initialize the active tool as "pen"
var activeTool = "pen";
