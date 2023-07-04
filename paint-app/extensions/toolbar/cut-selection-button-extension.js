class CutSelectionButtonExtension extends CopySelectionButtonExtension {
  onClick() {
    super.onClick().then(() => {
      this.paintApp.fireEvent("drawingArea.drawing:clearSelected");
      this.paintApp.fireEvent("drawingArea.selection:cleared");
      this.paintApp.fireEvent("drawingArea.drawing:clearOverlay");
    });
  }
}
