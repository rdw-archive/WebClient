class Slider extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);
		let range = document.createElement("input");
		range.type = "range";
		this._obj = range; // Alias for backwards compatibility
		this.setParent(parentFrame);

		const widgetContainer = new Frame(widgetName + "Container", parentFrame, "SliderContainer");
		this.container = widgetContainer;

		const label = new Label(widgetName + "Label", widgetContainer);
		label.createFontString(widgetName + "LabelText", "MEDIUM", "GameFontSmall");
		this.label = label;
		label._obj.htmlFor = widgetName;

		this.range = range;
		this.label = label;
	}
	setMinimum(minValue) {
		this.range.min = minValue;
	}
	setMaximum(maxValue) {
		this.range.max = maxValue;
	}
	setValue(newValue) {
		this.range.value = newValue;
	}
	getValue() {
		return this.range.value;
	}
	setLabelText(text) {
		this.label.setText(text);
	}
}
