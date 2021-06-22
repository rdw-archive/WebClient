class CheckButton extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		const widgetContainer = new Frame(widgetName + "Container", parentFrame, "CheckButtonContainer");

		this.container = widgetContainer;
		// 	widgetContainer:EnableMouse(true)

		// TODO DRY
		this._obj = document.createElement("input");
		this._obj.type = "checkbox";
		this._obj.id = widgetName;
		this._obj.className = "CheckButton";
		if (template) this._obj.className = template;

		this.setParent(widgetContainer);

		const label = new Label(widgetName + "Label", widgetContainer);
		label.createFontString(widgetName + "LabelText", "MEDIUM", "GameFontSmall");
		this.label = label;
		label._obj.htmlFor = widgetName;
		// todo ugly, use API?

		this.setName(widgetName);
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
