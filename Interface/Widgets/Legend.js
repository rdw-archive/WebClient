class Legend extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		// TODO DRY
		this._obj = document.createElement("legend");
		// this._obj.type = "button";
		this._obj.id = widgetName;
		if (template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	setName(newName) {
		this._obj.innerText = newName;
	}
	setClass(className) {
		this._obj.className = className;
	}
}
