const C_Settings = {
	SCHEMA_DEFINITION: SettingsCacheSchema,
	DEFAULT_SETTINGS_FILE_PATH: WEBCLIENT_SETTINGS_DIR + "/default-settings.json",
	USER_SETTINGS_FILE_PATH: WEBCLIENT_INTERFACE_DIR + "/settings-cache.json",
	settingsCache: new LocalCache(WEBCLIENT_SETTINGS_DIR + "/settings-cache.json"), // will update from cache
	defaultSettings: new LocalCache(WEBCLIENT_SETTINGS_DIR + "/default-settings.json"), // will be stored as-is
	validateDefaultSettings() {
		return this.validate(this.defaultSettings);
	},
	validateUserSettings() {
		if (!this.hasUserSettings()) return true; // We'll just use the defaults

		return this.validate(this.settingsCache);
	},
	validate(settings) {
		const schema = this.SCHEMA_DEFINITION;
		const areSettingsValid = C_Validation.validateUsingSchema(settings, schema);
		if (!areSettingsValid) return false;

		return true;
	},
	getDefaultSettings() {
		return this.defaultSettings;
	},
	loadDefaultSettings() {
		this.defaultSettings.load();
	},
	getUserSettings() {
		if (!this.hasUserSettings()) {
			INFO(format("Failed to get user settings from %s", this.USER_SETTINGS_FILE_PATH));
			return this.getDefaultSettings();
		}

		if (!this.validateUserSettings()) {
			INFO(format("Ignoring invalid user settings from %s", this.USER_SETTINGS_FILE_PATH));
			return this.getDefaultSettings();
			// TODO Don't discard them all, only the invalid properties?
		}
		return this.settingsCache;
	},
	hasUserSettings() {
		return C_FileSystem.fileExists(this.USER_SETTINGS_FILE_PATH);
	},
	loadSettingsCache() {
		if (!this.hasUserSettings()) {
			this.loadDefaultSettings();
			return;
		}

		this.settingsCache.setFilePath(this.USER_SETTINGS_FILE_PATH);
		this.settingsCache.load();
	},
	saveSettingsCache() {
		this.settingsCache.save();
	},
};

C_Settings.getValue = function (key) {
	return this.settingsCache.getValue(key);
};

C_Settings.setValue = function (key, value) {
	this.settingsCache.setValue(key, value);
};

C_Settings.loadDefaultSettings();
C_Settings.loadSettingsCache();
