// Get the toolbar buttons
var penButton = document.getElementById("penTool");
var eraserButton = document.getElementById("eraserTool");
var shapeButton = document.getElementById("shapeTool");

// Event listeners for button clicks
penButton.addEventListener("click", selectTool);
eraserButton.addEventListener("click", selectTool);
shapeButton.addEventListener("click", selectTool);

// Function to handle tool selection
function selectTool(event) {
  // Remove active class from all buttons
  penButton.classList.remove("active");
  eraserButton.classList.remove("active");
  shapeButton.classList.remove("active");

  // Add active class to the clicked button
  event.target.classList.add("active");

  // Get the selected tool from the data-tool attribute
  var selectedTool = event.target.getAttribute("data-tool");

  // You can add logic here to handle specific tool selection
  if (selectedTool === "eraser") {
    // Implement eraser functionality
    alert("Eraser selected");
    // Add your eraser code here
  } else {
    // Handle other tools
    alert("Tool selected: " + selectedTool);
  }
}
