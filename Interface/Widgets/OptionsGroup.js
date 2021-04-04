// TODO Rename to something less generic? Fieldset? OptionsGroup? Section?
class OptionsGroup extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		this.container = new Frame(widgetName + "Container", parentFrame, template);
		// this.groupTitle = this.container.createFontString(widgetName + "LegendText", "MEDIUM", "GameFontSmallest");
		this.fieldSet = new FieldSet(widgetName, this.container, template);
		// todo new FontString vs frame.createFontString
		this.legend = new Legend(widgetName + "Legend", this.fieldSet);
	}
	setCaption(captionText) {
		// this.groupTitle.setText(newTitle);
		this.legend.setName(captionText);
	}
	setCaptionStyle(template) {
		this.legend.setClass(template);
	}
}
