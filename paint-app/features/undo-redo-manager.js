class UndoRedoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.paintApp = null;
    this.pushState = this.pushState.bind(this);
    this.tryToUndo = this.tryToUndo.bind(this);
    this.tryToRedo = this.tryToRedo.bind(this);
    window.$UndoRedoManager = this;
  }

  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener("undoredo:pushState", this.pushState);
    this.paintApp.addEventListener("undoredo:undo", this.tryToUndo);
    this.paintApp.addEventListener("undoredo:redo", this.tryToRedo);
  }

  // Method to push a drawing state onto the Undo stack
  pushState(state) {
    this.undoStack.push(state);
    // Clear the redo stack when a new state is pushed
    this.redoStack = [];
    console.log("UndoRedo state pushed", this.undoStack.length);
  }

  // Method to undo the last drawing action
  undo() {
    const state = this.undoStack.pop();
    if (state) {
      this.redoStack.push(state);
      return state;
    }
    return null;
  }

  // Method to redo the last undone drawing action
  redo() {
    const state = this.redoStack.pop();
    if (state) {
      this.undoStack.push(state);
      return state;
    }
    return null;
  }

  // Method to check if there are any actions that can be undone
  canUndo() {
    return this.undoStack.length > 0;
  }

  // Method to check if there are any actions that can be redone
  canRedo() {
    return this.redoStack.length > 0;
  }
  tryToUndo() {
    const state = this.undo();
    if (null == state) return;
    this.paintApp.fireEvent("undoredo:undo:apply", state);
  }
  tryToRedo() {
    const state = this.redo();
    if (null == state) return;
    this.paintApp.fireEvent("undoredo:redo:apply", state);
  }
}
