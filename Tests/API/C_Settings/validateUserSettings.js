describe("The C_Settings API", () => {
	it("should always succeed in validating the user settings", () => {
		assertTrue(C_Settings.validateUserSettings());
	});
	it("should use the default settings if there are no user settings", () => {
		const nonexistentFile = "some/path/that/does/not/exist";
		C_Settings.USER_SETTINGS_FILE_PATH = nonexistentFile;

		assertFalse(C_FileSystem.fileExists(nonexistentFile));

		const userSettings = C_Settings.getUserSettings();
		const defaultSettings = C_Settings.getDefaultSettings();

		assertDeepEquals(userSettings, defaultSettings);
	});
	it("should use the default settings if user settings are invalid", () => {
		// The defaults are obviously valid, so we invalidate them by adding random garbage
		const settings = C_Settings.getDefaultSettings();
		assertTrue(C_Settings.validate(settings)); // Just to be EXTRA sure

		// Invalidate them
		settings.someRandomSettingThatWillNeverBeUsed = 42; // Now it's invalid, probably
		assertFalse(C_Settings.validate(settings)); // Again making sure

		// Write invalidated settings to disk so we can use it as a fake user settings file
		const invalidatedUserSettingsFilePath = "invalidatedDefaultSettings.json";
		assertFalse(C_FileSystem.fileExists(invalidatedUserSettingsFilePath));
		C_FileSystem.writeJSON(invalidatedUserSettingsFilePath, settings);
		assertTrue(C_FileSystem.fileExists(invalidatedUserSettingsFilePath));

		// The API should now load user settings from there any time they're requested (and not cached)
		const backup = C_Settings.USER_SETTINGS_FILE_PATH;
		C_Settings.USER_SETTINGS_FILE_PATH = invalidatedUserSettingsFilePath;

		// Since they are invalid, we expect the API to fall back to the defaults (which are valid)
		const userSettings = C_Settings.getUserSettings();
		const defaultSettings = C_Settings.getDefaultSettings();

		assertDeepEquals(userSettings, defaultSettings);
		// Should probably be moved to after()/teardown?
		C_FileSystem.removeFile(invalidatedUserSettingsFilePath);
		assertFalse(C_FileSystem.fileExists(invalidatedUserSettingsFilePath));
		// If we don't reset the path, the current settings will be written to the fixtures file (awkward)
		C_Settings.USER_SETTINGS_FILE_PATH = backup;
	});
});
