let C_Locales = {
	// TBD: Should this really be here? It also seems pointless to disable locales at runtime...
	supportedLocales: {
		[Enum.WEBCLIENT_LOCALE_STRING_ENGLISH]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_GERMAN]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_FRENCH]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_SPANISH]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_RUSSIAN]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_CHINESE_SIMPLIFIED]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_CHINESE_TRADITIONAL]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_ITALIAN]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_KOREAN]: true,
		[Enum.WEBCLIENT_LOCALE_STRING_PORTUGUESE]: true,
	},
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

		C_Settings.setValue("activeLocale", localeString);
		INFO(format("Set active locale to %s", localeString));
	},
	isRegisteredLocale(localeString) {
		return this.localizationTables[localeString] !== undefined;
	},
	getLocale() {
		return C_Settings.getValue("activeLocale");
	},
	getLocalizationTable(localeString = C_Settings.getValue("activeLocale")) {
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
