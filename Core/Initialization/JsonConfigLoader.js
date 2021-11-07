const { readFileSync, existsSync, writeFileSync } = require("fs");
const Joi = require("joi");

const schema = Joi.object({
	enableDevTools: Joi.boolean().optional(),
	// We don't support embedded docking modes since they break horribly (when using two windows) and I haven't found a way around it
	devToolsDockingMode: Joi.string().optional().valid("detach"),
	devToolsWindowStartPosition: Joi.object({
		x: Joi.number().required(),
		y: Joi.number().required(),
	}).optional(),
	devToolsWindowStartDimensions: Joi.object({
		width: Joi.number().required(),
		height: Joi.number().required(),
	}).optional(),
	maximizeDevToolsWindow: Joi.boolean().optional(),
	hideDevToolsWindowTitle: Joi.boolean().optional(),
});

const DEFAULT_MAIN_THREAD_SETTINGS_PATH = "Config/electron-main.js";

// Some people say using JSON configuration files is wrong, but it's far less annoying than the alternatives :/
class JsonConfigLoader {
	constructor() {
		this.settings = {};
		this.settingsPath = DEFAULT_MAIN_THREAD_SETTINGS_PATH;
	}
	setSettingsPath(filePath) {
		this.settingsPath = filePath;
	}
	loadSettingsFromDisk() {
		if (!existsSync(this.settingsPath))
			throw new Error("Failed to load settings from file " + this.settingsPath + " (File not found)");

		let settings = readFileSync(this.settingsPath);

		try {
			settings = JSON.parse(settings);
			this.settings = settings;
		} catch (SyntaxError) {
			throw new Error("Failed to load settings from file " + this.settingsPath + " (Invalid JSON)");
		}
		const validationResult = schema.validate(settings);
		if (validationResult.error)
			throw new Error("Failed to load settings from file " + this.settingsPath + " (Settings are invalid)");
	}
	saveSettingsToDisk() {
		const validatedSettings = {};

		for (const fieldName in this.settings) {
			const value = this.settings[fieldName];
			const validationResult = schema.validate({ [fieldName]: value });
			if (!validationResult.error) validatedSettings[fieldName] = value;
		}

		const serializedSettingsString = JSON.stringify(validatedSettings, null, "\t");
		writeFileSync(this.settingsPath, serializedSettingsString);
	}
}

module.exports = JsonConfigLoader;
