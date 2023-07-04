class UIValueViewerExtension {
  constructor(el, eventName, formatter) {
    this.el = el;
    this.eventName = eventName;
    this.formatter = formatter;
    this.paintApp = null;
  }
  init(paintApp) {
    this.paintApp = paintApp;
    this.paintApp.addEventListener(
      this.eventName,
      (v) => (this.el.innerHTML = this.formatter ? this.formatter(v) : v)
    );
  }
}
