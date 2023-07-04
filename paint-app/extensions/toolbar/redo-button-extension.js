class RedoButtonExtension extends ToolbarButtonExtension {
  onClick() {
    this.paintApp.fireEvent("undoredo:redo");
  }
}
