const assert = require("assert");
const fs = require("fs");

const JsonConfigLoader = require("./../../Core/Initialization/JsonConfigLoader");

const VALID_SETTINGS_EXAMPLE_FILE_PATH = "tempValidSettings.json";
const VALID_SETTINGS_EXAMPLE = {
	enableDevTools: false,
	devToolsDockingMode: "detach",
};

function createTemporarySettingsFiles() {
	fs.writeFileSync(VALID_SETTINGS_EXAMPLE_FILE_PATH, JSON.stringify(VALID_SETTINGS_EXAMPLE));
}

function removeTemporarySettingsFiles() {
	fs.unlinkSync(VALID_SETTINGS_EXAMPLE_FILE_PATH);
}

beforeEach(createTemporarySettingsFiles);
afterEach(removeTemporarySettingsFiles);

const loader = new JsonConfigLoader();

describe("Electron App Loader", function () {
	describe("Loading settings from disk", function () {
		it("should fail with an error if the configured settings file doesn't exist", function () {
			const settingsFilePath = "this/probably/does/not/exist";
			assert.strictEqual(fs.existsSync(settingsFilePath), false);

			loader.setSettingsPath(settingsFilePath);

			assert.throws(function () {
				loader.loadSettingsFromDisk();
			}, Error("Failed to load settings from file " + settingsFilePath + " (File not found)"));

			assert.deepStrictEqual(loader.settings, {}); // Settings are not loaded since it failed
		});

		it("should fail with an error if the configured settings file isn't valid JSON", function () {
			const settingsFilePath = "invalid.json";
			fs.writeFileSync(settingsFilePath, "something that's clearly not valid JSON");

			loader.setSettingsPath(settingsFilePath);
			assert.throws(function () {
				loader.loadSettingsFromDisk();
			}, Error("Failed to load settings from file " + settingsFilePath + " (Invalid JSON)"));

			fs.unlinkSync(settingsFilePath);
		});

		it("should fail with an error if the configured settings file contains invalid fields", function () {
			const settingsFilePath = "invalidFields.json";
			const jsonWithInvalidFields = {
				someInvalidField: 42,
			};
			fs.writeFileSync(settingsFilePath, JSON.stringify(jsonWithInvalidFields));

			loader.setSettingsPath(settingsFilePath);
			assert.throws(function () {
				loader.loadSettingsFromDisk();
			}, Error("Failed to load settings from file " + settingsFilePath + " (Settings are invalid)"));

			fs.unlinkSync(settingsFilePath);
		});

		it("should fail with an error if the configured settings file contains invalid properties", function () {
			const settingsFilePath = "invalidValues.json";
			const jsonWithInvalidValues = {
				enableDevTools: 42,
				devToolsDockingMode: 42,
			};
			fs.writeFileSync(settingsFilePath, JSON.stringify(jsonWithInvalidValues));

			loader.setSettingsPath(settingsFilePath);
			assert.throws(function () {
				loader.loadSettingsFromDisk();
			}, Error("Failed to load settings from file " + settingsFilePath + " (Settings are invalid)"));

			fs.unlinkSync(settingsFilePath);
		});

		it("should import the settings if the configured settings file is valid", function () {
			const settingsFilePath = "validSettings.json";
			const validSettings = {
				enableDevTools: true,
				devToolsDockingMode: "detach",
			};

			fs.writeFileSync(settingsFilePath, JSON.stringify(validSettings));

			loader.setSettingsPath(settingsFilePath);
			loader.loadSettingsFromDisk();

			assert.deepStrictEqual(loader.settings, validSettings);

			fs.unlinkSync(settingsFilePath);
		});
	});
	describe("Saving settings to disk", function () {
		it("should save the updated settings if they have been changed", function () {
			loader.setSettingsPath(VALID_SETTINGS_EXAMPLE_FILE_PATH);
			loader.loadSettingsFromDisk();

			assert.deepStrictEqual(loader.settings, VALID_SETTINGS_EXAMPLE);

			const modifiedSettings = {
				enableDevTools: true,
				devToolsDockingMode: "detach",
			};

			loader.settings = modifiedSettings;
			loader.saveSettingsToDisk();

			const fileContents = fs.readFileSync(VALID_SETTINGS_EXAMPLE_FILE_PATH);
			const serializedSettings = JSON.parse(fileContents);
			assert.deepStrictEqual(serializedSettings, modifiedSettings);
		});
		it("should create the settings file if it doesn't exist", function () {
			const settingsFilePath = "this-test-file-does-not-exist-probably.json";
			assert.strictEqual(fs.existsSync(settingsFilePath), false);

			loader.setSettingsPath(settingsFilePath);

			loader.settings = VALID_SETTINGS_EXAMPLE;
			loader.saveSettingsToDisk();

			const fileContents = fs.readFileSync(settingsFilePath);
			const serializedSettings = JSON.parse(fileContents);
			assert.deepStrictEqual(serializedSettings, VALID_SETTINGS_EXAMPLE);

			fs.unlinkSync(settingsFilePath);
		});
		it("should only persist fields that are valid and ignore the others", function () {
			const settingsWithUnsupportedEntriesFilePath = "settingsWithUnsupportedEntries.json";
			const settingsWithUnsupportedEntries = {
				enableDevTools: true,
				devToolsDockingMode: "detach",
				thisSettingShouldNotBeSaved: 42,
				thisAlsoShouldBeDropped: "cats are awesome",
			};

			const settingsWithOnlySupportedFields = {
				enableDevTools: true,
				devToolsDockingMode: "detach",
			};

			loader.settings = settingsWithUnsupportedEntries;
			loader.settingsPath = settingsWithUnsupportedEntriesFilePath;

			fs.existsSync(settingsWithUnsupportedEntriesFilePath, false);
			loader.saveSettingsToDisk();
			fs.existsSync(settingsWithUnsupportedEntriesFilePath, true);

			const fileContents = fs.readFileSync(settingsWithUnsupportedEntriesFilePath);
			const serializedSettings = JSON.parse(fileContents);
			assert.deepStrictEqual(serializedSettings, settingsWithOnlySupportedFields);

			fs.unlinkSync(settingsWithUnsupportedEntriesFilePath);
		});
	});
});
