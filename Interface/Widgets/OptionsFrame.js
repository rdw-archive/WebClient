var format = require("util").format;

class OptionsFrame extends Widget {
	constructor(widgetName, parentFrame, template = WIDGET_TEMPLATE_WINDOW) {
		super(widgetName, parentFrame, template);

		this.panels = [];
		this.categorySelectors = [];

		this.createWindow(parentFrame, template);
		this.setWindowTitle(widgetName);
	}
	createWindow(parentFrame, template) {
		this._obj = new Window(this.name + "Window", parentFrame, template);

		const leftPane = new Frame(this.name + "ContentLeft", this._obj.content, "OptionsFrameLeftPanel");
		this._obj.content.leftPane = leftPane;

		const rightPane = new Frame(this.name + "ContentRight", this._obj.content, "OptionsFrameRightPanel");
		this._obj.content.rightPane = rightPane;
	}
	setWindowTitle(text) {
		this._obj.setTitle(text);
	}
	// Add a new category to the list so that it may be accessed in the menu.
	addCategory(categoryName) {
		const categorySelectorFrame = new Frame(
			this.name + "_" + "CategorySelector" + "_" + categoryName,
			this._obj.content.leftPane,
			"OptionsMenuCategory"
		);

		const optionsFrame = this;
		categorySelectorFrame.setScript("OnClick", function () {
			DEBUG(format("Changing to options category %s", categoryName));
			optionsFrame.setActiveCategory(categoryName);
			optionsFrame.updateVisibleCategories();
		});

		const categoryText = categorySelectorFrame.createFontString("TODO", "MEDIUM", "CaptionFontNormal");
		categoryText.setText(categoryName);

		const panel = new Frame(
			this.name + "_" + categoryName + "_Panel",
			this._obj.content.rightPane,
			"OptionsFrameCategoryPanel"
		);
		panel.header = new Frame(this.name + "_" + categoryName + "_PanelHeader", panel, "OptionsFrameCategoryHeader");
		const headerText = panel.header.createFontString("TODO", "MEDIUM", "CaptionFontLarge");
		headerText.setText(categoryName);

		this.categorySelectors[categoryName] = categorySelectorFrame;
		this.panels[categoryName] = panel;

		// Auto-selecting the first added category seems like a sensible default
		if (!this.selectedCategory) this.setActiveCategory(categoryName);
		this.updateVisibleCategories();
	}
	removeCategory(categoryName) {}
	setActiveCategory(categoryName) {
		this.selectedCategory = categoryName;
		// 	if not categoryName then
		// 		return
		// 	end

		// 	if not self.panels[categoryName] or not self.categorySelectors[categoryName] then
		// 		return
		// 	end
	}
	updateVisibleCategories() {
		const categoryName = this.selectedCategory;
		for (const category in this.categorySelectors) {
			const frame = this.categorySelectors[category];
			if (category === categoryName) {
				// 			-- todo css here, not good
				// 			-- C_Audio.PlaySound(SOUNDKIT.IG_MAINMENU_OPTION) -- Sound effects are NYI
				frame._obj.className = "OptionsMenuSelectedCategory"; // todo ugly, apis
				this.panels[category].show();
			} else {
				frame._obj.className = "OptionsMenuCategory";
				this.panels[category].hide();
			}
		}
	}
	isShown() {
		return this._obj.isShown();
	}
	toggle() {
		return this._obj.toggle();
	}
	show() {
		return this._obj.show();
	}
	hide() {
		return this._obj.hide();
	}
}
