class ProgressBar extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		// const progress = document.createElement("progress");
		// this._obj = progress;
		// this.setParent(parent);
		// this.setName(widgetName);
		// progress.id = widgetName;

		// UIParent._obj.appendChild(this._obj);

		this._obj = document.createElement("progress");
		this._obj.max = 100;
		this._obj.value = 0;
		this._obj.id = widgetName;
		if (template) this._obj.className = template;

		this.setName(widgetName);
		this.setParent(parentFrame);
	}
	setValue(newValue) {
		this._obj.value = newValue;
	}
	setMaxValue(newValue) {
		this._obj.max = newValue;
	}
}
