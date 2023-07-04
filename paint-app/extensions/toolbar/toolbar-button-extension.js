class ToolbarButtonExtension {
  constructor(buttonElement) {
    this.buttonElement = buttonElement;
    this.paintApp = null;

    this.onClick = this.onClick.bind(this);
  }

  init(paintApp) {
    this.paintApp = paintApp;
    this.buttonElement.addEventListener("click", this.onClick);
  }

  destroy() {
    this.buttonElement.removeEventListener("click", this.onClick);
  }

  onClick() {
  }
}
