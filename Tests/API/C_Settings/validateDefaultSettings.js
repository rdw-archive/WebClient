describe("The C_Settings API", function () {
	it("should always succeed in validating the default settings", function () {
		assertTrue(C_Settings.validateDefaultSettings());
	});
});
