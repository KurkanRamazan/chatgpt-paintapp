class UIValueBinderExtension {
  constructor(el, changeEventName, changedEventName) {
    this.el = el;
    this.changeEventName = changeEventName;
    this.changedEventName = changedEventName;
    this.paintApp = null;
    this.el.addEventListener("change", (event) =>
      this.paintApp.fireEvent(this.changeEventName, event.target.value)
    );
  }
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      this.changedEventName,
      (v) => (this.el.value = v)
    );
  }
}
