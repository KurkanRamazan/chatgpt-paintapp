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

  // Call the action associated with the selected tool
  toolbarActions[selectedTool]();
}
// Dictionary to map toolbar buttons to actions
var toolbarActions = {
  pen: function () {
    console.log("Pen selected");
    // Add code for pen tool action
  },
  eraser: function () {
    console.log("Eraser selected");
    // Add code for eraser tool action
  },
  shapes: function () {
    console.log("Shapes selected");
    // Add code for shape tool action
  },
};
