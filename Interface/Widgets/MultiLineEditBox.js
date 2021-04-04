class MultiLineEditBox extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		// TODO DRY
		this._obj = document.createElement("textarea");
		this._obj.cols = 1;
		this._obj.rows = 1;
		this._obj.id = widgetName;
		if (template) this._obj.className = template;

		// // Create label
		// this.label = document.createElement("label");
		// this.label.htmlFor = widgetName;
		// // todo use label class
		// parentFrame._obj.appendChild(this.label);

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	setNumRows(numRows) {
		this._obj.rows = numRows;
	}
	setNumColumns(numColumns) {
		this._obj.cols = numColumns;
	}
	setPlaceholderText(text) {
		this._obj.placeholder = text;
	}
	// setLabelText(newLabelText) {
	// 	this.label.innerText = newLabelText;
	// }
	// setLabelStyle(newLabelStyle) {
	// 	this.label.className = newLabelStyle;
	// }
	getText() {
		return this._obj.value;
	}
	setText(newText) {
		this._obj.value = newText;
	}
	setResizable(resizableFlag = true) {
		this._obj.style.resize = resizableFlag ? "none" : "both";
	}
	// tbd disable
	disable() {
		this._obj.disabled = true;
	}
	enable() {
		this._obj.disabled = false;
	}
}
