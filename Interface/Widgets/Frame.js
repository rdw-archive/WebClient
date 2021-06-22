class Frame extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		this._obj = document.createElement("div");
		this._obj.id = widgetName;

		if (template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	createFontString(widgetName, layer, inheritsFrom) {
		const fontString = new FontString(widgetName, layer, inheritsFrom);
		fontString.setParent(this);
		// this._obj.appendChild(fontString.obj)
		return fontString;
	}
	setGridLayout(numColumns, numRows) {
		this._obj.style.display = "grid";
		this._obj.style.gridTemplateColumns = "repeat(" + numColumns + ", 50px)";
		this._obj.style.gridTemplateRows = "repeat(" + numRows + ", 50px)";
	}
	showScrollbarY() {
		this._obj.style.overflowY = "scroll";
	}
	hideScrollbarY() {
		this._obj.style.removeProperty("overflow-y");
	}
	makeClosable() {
		WorldFrame.addClosableWindow(this);
	}
}
