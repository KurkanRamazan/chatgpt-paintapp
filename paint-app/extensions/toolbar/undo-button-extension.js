class UndoButtonExtension extends ToolbarButtonExtension {
  onClick() {
    this.paintApp.fireEvent("undoredo:undo");
  }
}
