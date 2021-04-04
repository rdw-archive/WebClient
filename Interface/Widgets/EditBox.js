class EditBox extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		// TODO DRY
		this._obj = document.createElement("input");
		this._obj.type = "text";
		this._obj.id = widgetName;
		if (template) this._obj.className = template;

		// Create label
		this.label = document.createElement("label");
		this.label.htmlFor = widgetName;
		// todo use label class
		parentFrame._obj.appendChild(this.label);

		// this.hideLabel();

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	setLabelText(newLabelText) {
		this.label.innerText = newLabelText;
		this.showLabel();
	}
	setLabelStyle(newLabelStyle) {
		this.label.className = newLabelStyle;
	}
	getText() {
		return this._obj.value;
	}
	setText(newText) {
		this._obj.value = newText;
	}
	setPlaceholderText(text) {
		this._obj.placeholder = text;
	}
	showLabel() {
		this.label.style.display = 'inherit';
	}
	hideLabel() {
		this.label.style.display = 'none';
	}
	// tbd dry
	disable() {
		this._obj.disabled = true;
	}
	enable() {
		this._obj.disabled = false;
	}
}
