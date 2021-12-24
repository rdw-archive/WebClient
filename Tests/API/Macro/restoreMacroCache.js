describe("restoreMacroCache", () => {
	let macroCachePath = null;
	const invalidMacroCachePath = NODE.path.join(WEBCLIENT_TESTS_DIR, "does-not-exist.json");
	before(() => {
		macroCachePath = C_Settings.getValue("macroCachePath");
	});

	after(() => {
		C_Settings.setValue("macroCachePath", macroCachePath);
		C_FileSystem.removeFile(invalidMacroCachePath);
	});

	it("should automatically create an empty macro-cache.json file if none is present", () => {
		assertFalse(C_FileSystem.fileExists(invalidMacroCachePath));

		C_Settings.setValue("macroCachePath", invalidMacroCachePath);
		C_Macro.restoreMacroCache();
		assertTrue(C_FileSystem.fileExists(invalidMacroCachePath));
	});
});
