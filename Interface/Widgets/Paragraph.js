class Paragraph extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		// TODO DRY
		this._obj = document.createElement("p");
		if (widgetName) this._obj.id = widgetName;
		if (template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	setText(newText) {
		this._obj.innerText = newText;
	}
}
