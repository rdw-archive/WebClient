// It's a button. What more do you need to know?
class FieldSet extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		// TODO DRY
		this._obj = document.createElement("fieldset");
		// this._obj.type = "button";
		this._obj.id = widgetName;
		if(template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
}