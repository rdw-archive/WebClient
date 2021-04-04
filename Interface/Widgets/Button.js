class Button extends Widget {
	constructor(widgetName, parentFrame, template = "Button") {
		super(widgetName, parentFrame, template);

		// TODO DRY
		this._obj = document.createElement("input");
		this._obj.type = "button";
		this._obj.id = widgetName;
		this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);

		this.enableMouse(true);
	}
	setText(buttonText) {
		this._obj.value = buttonText;
	}
	setIcon(iconPath) {
		this._obj.style.backgroundImage = "url('" + iconPath + "')";
	}
	disable() {
		this._obj.disabled = true;
	}
	enable() {
		this._obj.disabled = false;
	}
}
