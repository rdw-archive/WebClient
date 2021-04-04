class CheckButton extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		const widgetContainer = new Frame(widgetName + "Container", parentFrame, "CheckButtonContainer");
		const label = new Label(widgetName + "Label", widgetContainer);
		label.createFontString(widgetName + "LabelText", "MEDIUM", "GameFontSmall");
		// todo ugly, use API?
		label._obj.htmlFor = widgetName;
		this.container = widgetContainer;
		this.label = label;
		// 	widgetContainer:EnableMouse(true)

		// TODO DRY
		this._obj = document.createElement("input");
		this._obj.type = "checkbox";
		this._obj.id = widgetName;
		if (template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	setText(text) {
		this.label.setText(text);
	}
	setChecked(state) {
		this._obj.checked = state;
	}
	isChecked() {
		return this._obj.checked;
	}
}
