const { readFileSync, existsSync, writeFileSync } = require("fs");
const Joi = require("joi");

const schema = Joi.object({
    enableDevTools: Joi.boolean().optional(),
    devToolsDockingMode: Joi.string().optional().valid("right", "bottom", "undocked", "detach")
});

const DEFAULT_MAIN_THREAD_SETTINGS_PATH = "Config/electron-main.js";
// ElectronAppLauncher
class ElectronAppLoader {
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

module.exports = ElectronAppLoader;
