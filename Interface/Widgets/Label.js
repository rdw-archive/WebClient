class Label extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		this._obj = document.createElement("label");
		this._obj.id = widgetName;

		if (template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	// --- Create and return a new FontString.
	createFontString(widgetName, layer, inheritsFrom) {
		const fontString = new FontString(widgetName, layer, inheritsFrom);
		fontString.setParent(this);
		this.fontString = fontString;
		// this._obj.appendChild(fontString.obj)
		return fontString;
	}
	setText(text) {
		this.fontString.setText(text);
	}
}
