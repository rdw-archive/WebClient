var format = require("util").format;

let C_Locales = {
	localizationTables: {},
	lookupMetatable: {
		get: function (target, propertyName) {
			//console.log("Detected metatable lookup of property " + propertyName);
			return propertyName in target ? target[propertyName] : propertyName;
		},
		set: function (target, propertyName, newValue) {
			// console.log("Detected metatable set of new value " + newValue + " for property " + propertyName);
			target[propertyName] = newValue;
			return true;
		},
	},
	setLocale(localeString) {
		if (!this.isRegisteredLocale(localeString)) {
			WARNING(format("Failed to set locale %s (not a valid localeString)", localeString));
			return;
		}

		WEBCLIENT_ACTIVE_LOCALE = localeString;
		INFO(format("Set active locale to %s", localeString));
	},
	isRegisteredLocale(localeString) {
		return this.localizationTables[localeString] !== undefined;
	},
	getLocale() {
		return WEBCLIENT_ACTIVE_LOCALE;
	},
	getLocalizationTable(localeString = WEBCLIENT_ACTIVE_LOCALE) {
		return this.localizationTables[localeString];
	},
	// TBD can this be removed? Looks like it's not used anywhere...
	updateLocalizationTable(localeString, localizationTable) {
		// We don't want to clear existing entries (nor the Proxy), so simply copying all updates values seems fine
		for (const phrase in localizationTable) {
			const translatedPhrase = localizationTable[phrase];
			this.localizationTables[localeString][phrase] = translatedPhrase;
		}
	},
	getRegisteredLocales() {
		return this.localizationTables;
	},
	registerNewLocale(localeString) {
		if (this.isLocaleRegistered(localeString)) {
			WARNING(format("Failed to register new locale %s (this locale already exists)", localeString));
			return;
		}

		const localizationTable = this.createLocalizationTable(localeString);
		DEBUG(format("Registered new locale %s", localeString));

		return localizationTable;
	},
	isLocaleRegistered(localeString) {
		return this.localizationTables[localeString] !== undefined;
	},
	createLocalizationTable(localeString) {
		const localizationTable = new Proxy({}, this.lookupMetatable);
		this.localizationTables[localeString] = localizationTable;
		return localizationTable;
	},
};
