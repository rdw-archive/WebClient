describe("Shared path constants", () => {
	it("should export WEBCLIENT_ROOT_DIR", () => {
		assertEquals(WEBCLIENT_ROOT_DIR, process.cwd());
	});

	it("should export WEBCLIENT_ASSETS_DIR", () => {
		assertEquals(WEBCLIENT_ASSETS_DIR, path.join(WEBCLIENT_ROOT_DIR, "Assets"));
	});

	it("should export WEBCLIENT_INTERFACE_DIR", () => {
		assertEquals(WEBCLIENT_INTERFACE_DIR, path.join(WEBCLIENT_ROOT_DIR, "Interface"));
	});

	it("should export WEBCLIENT_ADDONS_DIR", () => {
		assertEquals(WEBCLIENT_ADDONS_DIR, path.join(WEBCLIENT_INTERFACE_DIR, "Addons"));
	});

	it("should export WEBCLIENT_LOCALES_DIR", () => {
		assertEquals(WEBCLIENT_LOCALES_DIR, path.join(WEBCLIENT_INTERFACE_DIR, "Locales"));
	});

	it("should export WEBCLIENT_EXPORTS_DIR", () => {
		assertEquals(WEBCLIENT_EXPORTS_DIR, path.join(WEBCLIENT_ROOT_DIR, "Exports"));
	});

	it("should export WEBCLIENT_SETTINGS_DIR", () => {
		assertEquals(WEBCLIENT_SETTINGS_DIR, path.join(WEBCLIENT_ROOT_DIR, "Core", "Settings"));
	});

	it("should export WEBCLIENT_TESTS_DIR", () => {
		assertEquals(WEBCLIENT_TESTS_DIR, path.join(WEBCLIENT_ROOT_DIR, "Tests"));
	});

	it("should export WEBCLIENT_FIXTURES_DIR", () => {
		assertEquals(WEBCLIENT_FIXTURES_DIR, path.join(WEBCLIENT_TESTS_DIR, "Fixtures"));
	});
});
