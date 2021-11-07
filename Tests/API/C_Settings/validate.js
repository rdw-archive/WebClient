describe("The C_Settings API", function () {
	it("should succeed validating arbitrary settings when the default settings are passed", function () {
		const defaultSettings = C_FileSystem.readJSON(C_Settings.DEFAULT_SETTINGS_FILE_PATH);
		assertTrue(C_Settings.validate(defaultSettings));
	});
	it("should fail validating arbitrary settings when nothing is passed", function () {
		assertFalse(C_Settings.validate(undefined));
		assertFalse(C_Settings.validate(null));
	});
	it("should fail validating arbitrary settings when an empty object is passed", function () {
		assertFalse(C_Settings.validate({}));
	});
	it("should fail validating arbitrary settings when objects of the wrong type are passed", function () {
		assertFalse(C_Settings.validate("NotASettingsObject"));
		assertFalse(C_Settings.validate(42));
		assertFalse(C_Settings.validate(function () {}));
	});
});
