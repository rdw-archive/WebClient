const C_Settings = {
	SCHEMA_DEFINITION: SettingsCacheSchema,
	DEFAULT_SETTINGS_FILE_PATH: WEBCLIENT_SETTINGS_DIR + "/default-settings.json",
	USER_SETTINGS_FILE_PATH: WEBCLIENT_INTERFACE_DIR + "/settings-cache.json",
	validateDefaultSettings() {
		const settings = C_FileSystem.readJSON(this.DEFAULT_SETTINGS_FILE_PATH);
		return this.validate(settings);
	},
	validateUserSettings() {
		if (!this.hasUserSettings()) return true; // We'll just use the defaults
		const settings = C_FileSystem.readJSON(this.USER_SETTINGS_FILE_PATH);
		return this.validate(settings);
	},
	validate(settings) {
		const schema = this.SCHEMA_DEFINITION;
		const areSettingsValid = C_Validation.validateUsingSchema(settings, schema);
		if (!areSettingsValid) return false;

		return true;
	},
	getDefaultSettings() {
		// Caching is NYI, so we just load them from disk (bad)
		return C_FileSystem.readJSON(this.DEFAULT_SETTINGS_FILE_PATH);
	},
	loadDefaultSettings() {
		WebClient.settings = this.getDefaultSettings();
	},
	getUserSettings() {
		// Caching is NYI, so we just load them from disk (bad)

		if (!this.hasUserSettings()) {
			INFO(format("Failed to get user settings from %s", this.USER_SETTINGS_FILE_PATH));
			return this.getDefaultSettings();
		}

		if (!this.validateUserSettings()) {
			INFO(format("Ignoring invalid user settings from %s", this.USER_SETTINGS_FILE_PATH));
			return this.getDefaultSettings();
			// TODO Don't discard them all, only the invalid properties?
		}
		return C_FileSystem.readJSON(this.USER_SETTINGS_FILE_PATH);
	},
	hasUserSettings() {
		return C_FileSystem.fileExists(this.USER_SETTINGS_FILE_PATH);
	},
	loadSettingsCache() {
		if (!this.hasUserSettings()) this.loadDefaultSettings();
		else WebClient.settings = C_FileSystem.readJSON(this.USER_SETTINGS_FILE_PATH, WebClient.settings);
	},
	saveSettingsCache() {
		C_FileSystem.writeJSON(this.USER_SETTINGS_FILE_PATH, WebClient.settings);
	},
};

C_Settings.getValue = function (key) {
	if (WebClient.settings[key] === undefined) throw new RangeError("Invalid settings key " + key);
	return WebClient.settings[key];
};

C_Settings.setValue = function (key, value) {
	if (WebClient.settings[key] === undefined) throw new RangeError("Invalid settings key " + key);
	if (value === undefined) throw new RangeError("Invalid value " + value + " for settings key " + key);
	WebClient.settings[key] = value;
};

C_Settings.loadSettingsCache();
