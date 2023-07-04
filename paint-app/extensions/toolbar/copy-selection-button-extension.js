class CopySelectionButtonExtension extends ToolbarButtonExtension {
  constructor(el) {
    super(el);
    this.hideElement();
  }
  init(paintApp) {
    super.init(paintApp);
    paintApp.addEventListener("drawingArea.selection:cleared", () =>
      this.hideElement()
    );
    paintApp.addEventListener("drawingArea.selection:selected", () =>
      this.showElement()
    );
  }
  hideElement() {
    this.buttonElement.style.display = "none";
  }
  showElement() {
    this.buttonElement.style.display = "inline-block";
  }
  onClick() {
    return new Promise((pres, prej) => {
      this.paintApp.fireEvent(
        "drawingArea.selection:createCopy",
        (tempCanvas) => {
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
        }
      );
    });
  }
}
