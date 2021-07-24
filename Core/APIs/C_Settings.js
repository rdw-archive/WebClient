const C_Settings = {
	supportedconfigurationSchemas: {
		addons: AddonOptionsSchema,
		debugging: DebuggingOptionsSchema,
		events: EventOptionsSchema,
		keybindings: KeybindingOptionsSchema,
		localization: LocalizationOptionsSchema,
		macros: MacroOptionsSchema,
		networking: NetworkingOptionsSchema,
		rendering: RenderingOptionsSchema,
		macros: MacroOptionsSchema,
	},
	localizationOptionsFilePath: WEBCLIENT_SETTINGS_DIR + "/localization.json",
	keybindingOptionsFilePath: WEBCLIENT_SETTINGS_DIR + "/localization.json",
	validateAll() {
		for (const configFileName in this.supportedconfigurationSchemas) {
			const schema = this.supportedconfigurationSchemas[configFileName];
			const configFilePath =
				WEBCLIENT_SETTINGS_DIR + "/" + configFileName + ".json";

			DEBUG(format("Validating settings from %s", configFilePath));

			const settings = C_FileSystem.readJSON(configFilePath);
			const areSettingsValid = C_Validation.validateUsingSchema(
				settings,
				schema
			);
			if (!areSettingsValid) return false;
		}

		return true;
	},
};

C_Settings.getValue = function (key) {
	return WebClient.metadata.settings[key] || "";
};

C_Settings.setValue = function (key, value) {
	WebClient.metadata.settings[key] = value;
};
