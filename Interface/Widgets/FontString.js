class FontString extends Widget {
	constructor(widgetName, layer, template) {
		super(widgetName, false, template); // todo parent ??
		// layer = BACKGROUND by default?
		// template = GameFontNormal by default?
		this._obj = document.createElement("span");
		this.setName(widgetName);
		this._obj.id = widgetName;
		this._obj.className = template;
		// 	-- obj.style.zIndex = FRAME_STRATA["MEDIUM"] -- This needs unit tests to do right; should be parent + 1 but only in the strata's interval...
	}
	setText(newText = "") {
		this._obj.innerText = newText;
	}
}
