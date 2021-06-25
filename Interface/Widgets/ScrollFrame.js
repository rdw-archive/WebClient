class ScrollFrame extends Frame {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		this.setClass("ScrollFrame");
		this.setParent(parentFrame);

		if(!template) return;

		this.setClass(template);
	}
}