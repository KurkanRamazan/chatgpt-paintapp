class ToolbarExtension {
  constructor(toolbarElement) {
    this.toolbarElement = toolbarElement;
    this.paintApp = null;
    this.onActiveToolChanged = this.onActiveToolChanged.bind(this);

    this.registerToolButtons();
    this.registerTabs();
  }
  get activeTool() {
    return this.paintApp.drawingTool;
  }
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      "paintApp.drawingTool:changed",
      this.onActiveToolChanged
    );
  }

  destroy() {
    this.removeToolbar();
  }
  registerTabs() {
    var tabButtons = this.toolbarElement.querySelectorAll(".tabButton");
    tabButtons.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchTab(e);
      });
    });
  }
  switchTab(event) {
    const tabId = event.target.getAttribute("data-tab-id");
    // Hide all tab contents
    var tabs = this.toolbarElement.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }

    // Hide all tab buttons
    var tabButtons = this.toolbarElement.getElementsByClassName("tabButton");
    for (var i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove("active");
    }

    // Show the selected tab content
    this.toolbarElement
      .querySelector(`[id=${JSON.stringify(tabId)}]`)
      .classList.add("active");

    // Show the selected tab button as active
    event.currentTarget.classList.add("active");
  }
  registerToolButtons() {
    // Register event listeners for tool buttons
    const toolButtons =
      this.toolbarElement.querySelectorAll(".toolbar-command");
    toolButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const toolName = button.dataset.tool;
        if (!toolName) return;
        this.paintApp.fireEvent("paintApp.drawingTool:change", toolName);
      });
    });
  }

  onActiveToolChanged(toolName) {
    // Update the active tool in the toolbar
    const toolButtons =
      this.toolbarElement.querySelectorAll(".toolbar-command");
    toolButtons.forEach((button) => {
      const isActive = button.dataset.tool === toolName;
      button.classList.toggle("active", isActive);
    });
  }
}
