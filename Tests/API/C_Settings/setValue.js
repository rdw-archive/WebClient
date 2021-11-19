describe("setValue", function () {
	it("should throw a RangeError if the given settings key is invalid", function () {
		const invalidSettingsKey = "asdfThisDoesNotExistASDF";
		const rangeError = new RangeError("Invalid settings key " + invalidSettingsKey);
		assertThrows(() => C_Settings.setValue(invalidSettingsKey, 42), rangeError);
	});

	it("should throw a RangeError if the given settings value is invalid", function () {
		const validSettingsKey = "version";
		const rangeError = new RangeError("Invalid value undefined for settings key " + validSettingsKey);
		assertThrows(() => C_Settings.setValue(validSettingsKey), rangeError);
	});
});
