const assert = require("assert");
const fs = require("fs");

const ElectronAppLoader = require("./../../Core/ElectronAppLoader");

const loader = new ElectronAppLoader();

describe("Electron App Loader", function() {
    describe("Loading settings from disk", function() {
        it("should fail with an error if the configured settings file doesn't exist", function() {
            const settingsFilePath = "this/probably/does/not/exist";
            assert.strictEqual(fs.existsSync(settingsFilePath), false);

            loader.setSettingsPath(settingsFilePath);

            assert.throws(function() {
                loader.loadSettingsFromDisk();
            }, Error("Failed to load settings from file " + settingsFilePath + " (File not found)"));

            assert.deepStrictEqual(loader.settings, {}); // Settings are not loaded since it failed
        });

        it("should fail with an error if the configured settings file isn't valid JSON", function() {
            const settingsFilePath = "invalid.json";
            fs.writeFileSync(settingsFilePath, "something that's clearly not valid JSON");

            loader.setSettingsPath(settingsFilePath);
            assert.throws(function() {
                loader.loadSettingsFromDisk();
            }, Error("Failed to load settings from file " + settingsFilePath + " (Invalid JSON)"));

            fs.unlinkSync(settingsFilePath);
        });

        it("should fail with an error if the configured settings file contains invalid fields", function() {});

        it("should import the settings if the configured settings file is valid", function() {});
    });
    describe("Saving settings to disk", function() {
        it("should save the updated settings if they have been changed", function() {});
        it("should create the settings file if it doesn't exist", function() {});
        it("should only persist fields that are valid and ignore the others", function() {});
    });
});
