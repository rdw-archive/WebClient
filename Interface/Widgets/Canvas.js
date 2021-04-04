class Canvas extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		this._obj = document.createElement("canvas");
		this._obj.id = widgetName;
		if(template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
}
