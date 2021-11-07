const AddonOptionsFrame = new Window("AddonOptionsFrame");
AddonOptionsFrame.setTitle(L["Installed Addons"]);
AddonOptionsFrame.hide();

AddonOptionsFrame.onLoad = function () {
	this.createWidgets();
	this.registerEvents();
};

AddonOptionsFrame.createWidgets = function () {
	this.createScrollFrame();
	this.createReloadButton();
};

AddonOptionsFrame.createScrollFrame = function () {
	this.addonList = new ScrollFrame("AddonOptionsFrame_InstalledAddonsList", this.content);
	this.createCheckButtons();
	this.updateCheckButtons();
};

AddonOptionsFrame.createCheckButtons = function () {
	this.checkboxes = {};

	const installedAddons = C_Addons.getInstalledAddons();
	for (const addonName of installedAddons) {
		const checkbox = new CheckButton("AddonOptionsFrame_" + addonName + "_CheckButton", this.addonList);
		checkbox.setText(addonName);
		checkbox.setChecked(C_Addons.isAddonEnabled(addonName));
		checkbox.setScript("OnClick", function () {
			const loadedState = checkbox.isChecked();
			if (loadedState) C_Addons.enableAddon(addonName);
			else C_Addons.disableAddon(addonName);

			if (!loadedState) AddonOptionsFrame.reloadButton.setClass("HighlightButton");
		});

		this.checkboxes[addonName] = checkbox;
	}
};
AddonOptionsFrame.updateCheckButtons = function () {
	const installedAddons = C_Addons.getInstalledAddons();
	for (const addonName of installedAddons) {
		const checkbox = this.checkboxes[addonName]; // It's safe since new addons are activated after a reload only
		checkbox.setChecked(C_Addons.isAddonEnabled(addonName));
	}
};

AddonOptionsFrame.createReloadButton = function () {
	const reloadButton = new Button("AddonOptionsFrame_ReloadButton", AddonOptionsFrame.content);
	reloadButton.setText(L["Reload"]);
	reloadButton.setScript("OnClick", function () {
		C_System.reloadRenderProcess();
	});

	this.reloadButton = reloadButton;
};

AddonOptionsFrame.registerEvents = function () {
	C_EventSystem.registerEvent("ADDON_LOADED", "AddonOptionsFrame", this.onAddonLoaded);
};

AddonOptionsFrame.onAddonLoaded = function (event, addonName) {
	AddonOptionsFrame.updateCheckButtons();
};

AddonOptionsFrame.onLoad();
