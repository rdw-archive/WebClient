class Window extends Widget {
	constructor(widgetName, parentFrame, template = WIDGET_TEMPLATE_WINDOW) {
		super(widgetName, parentFrame, template);

		const window = new Frame(widgetName + "Window", parentFrame, template);
		this._obj = window;
		this.titleBar = new Frame(widgetName + "TitleBar", window, WIDGET_TEMPLATE_WINDOW_TITLEBAR);
		this.titleText = this.titleBar.createFontString(widgetName + "TitleText", "HIGH", "WindowTitleFontNormal"); // todo layer NYI, Fonts NYI

		this.minButton = new Frame(widgetName + "MinimizeButton", this.titleBar, WIDGET_TEMPLATE_WINDOW_MINIMIZEBUTTON);
		this.maxButton = new Frame(widgetName + "MaximizeButton", this.titleBar, WIDGET_TEMPLATE_WINDOW_MAXIMIZEBUTTON);
		this.closeButton = new Frame(widgetName + "CloseButton", this.titleBar, WIDGET_TEMPLATE_WINDOW_CLOSEBUTTON);
		const closeIcon = this.closeButton.createFontString(widgetName + "CloseButtonIcon", "HIGH", "BoldFontHuge");
		closeIcon.setClass("WindowCloseIcon");

		const self = this; // It's a thing of beauty... just like the rest of this cursed language
		function minimizeWindow() {
			self.minimize();
		}
		this.minButton.setScript("OnClick", minimizeWindow);

		function maximizeWindow() {
			self.maximize();
		}
		this.maxButton.setScript("OnClick", maximizeWindow);

		function closeWindow() {
			self._obj.hide();
		}
		this.closeButton.setScript("OnClick", closeWindow);

		this.content = new Frame(widgetName + "Content", window, WIDGET_TEMPLATE_WINDOW_CONTENTPANE);
		this.statusBar = new Frame(widgetName + "StatusBar", window, WIDGET_TEMPLATE_WINDOW_STATUSBAR);

		window.enableMouse(true); // clicks shouldn't pass through as it makes it feel like an overlay and not an actual window
		this.content.enableMouse(true);
	}
	setTitle(text) {
		this.titleText.setText(text);
	}
	setStatus(text) {
		this.statusBar.text.setText(text);
	}
	minimize() {
		DEBUG("NYI: Minimizing window " + this.name);
	}
	maximize() {
		DEBUG("NYI: Maximizing window " + this.name);
	}
	isShown() {
		return this._obj.isShown();
	}
	show() {
		this._obj.show();
	}
	hide() {
		this._obj.hide();
	}
	addContent(frame) {
		frame.setParent(this.content);
	}
}
