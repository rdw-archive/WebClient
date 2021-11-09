var format = require("util").format;

class AddOn {
	constructor(addonName, isLoadOnDemand = false) {
		this.name = addonName;
		this.isLoadOnDemand = isLoadOnDemand;

		if (isLoadOnDemand) return; // Deferred loading means we don't need to do anything else here

		const self = this;
		C_EventSystem.registerEvent("ADDON_LOADED", addonName, function (event, name) {
			self.onAddonLoaded(event, name);
		});
	}
	onAddonLoaded(event, addonName) {
		if (addonName !== this.name) return;

		C_EventSystem.unregisterEvent("ADDON_LOADED", this.name);
		INFO(format("%s: Addon was successfully loaded", this.name));

		if (!(this.onLoad instanceof Function)) return;
		this.onLoad();
	}
}
