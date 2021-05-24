class Widget extends ScriptObject {
	constructor(widgetName) {
		super();
		this._obj = {}; // Should always be replaced with an actual HTML element in derived classes; this is just to allow accessing properties without erroring out
		this.name = widgetName;
	}
	// TBD: Do we need getters and setters? Seems pointless, unless the goal is to provide a streamlined interface that's easier to change later
	getName() {
		return this.name;
	}
	setName(newName) {
		this.name = newName;
	}
	isObjectType(objectType) {
		return this.type === objectType;
	}
	getAlpha() {
		return this.alpha;
	}
	setAlpha(opacityPercent) {
		this.alpha = opacityPercent;
	}
	getObjectType() {
		return this.type;
	}
	setShown(showFlag) {
		if (showFlag) this.show();
		else this.hide();
	}
	show() {
		this._obj.style.display = "";
	}
	hide() {
		this._obj.style.display = "none";
	}
	isShown() {
		return this._obj.style.display !== "none";
	}
	toggle() {
		if (this.isShown()) this.hide();
		else this.show();
	}
	getParent() {
		return this.parent;
	}
	setParent(parentFrame) {
		if (window.UIParent !== undefined) parentFrame = parentFrame || UIParent;
		this.parent = parentFrame;

		const parentObj = (parentFrame && parentFrame._obj) || document.body;
		parentObj.appendChild(this._obj);
	}
	setObjectType(newObjectType) {
		this.type = newObjectType;
	}
	enableMouse(enableFlag) {
		if (enableFlag) this._obj.style.pointerEvents = "all";
		else this._obj.style.pointerEvents = "none";
	}
	enableMouseWheel(enableFlag) {
		this.enableMouse(enableFlag); // this is not accurate, but will do for the time being
	}
	remove() {
		const element = this._obj;
		element.parentNode.removeChild(element);
		// It's not actually destroyed, but should be garbage-collected once it's no longer referenced?
	}
	setClass(className) {
		this._obj.className = className;
	}
}
