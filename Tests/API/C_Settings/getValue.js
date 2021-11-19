describe("getValue", function () {
	it("should throw a RangeError if the given settings key is invalid", function () {
		const invalidSettingsKey = "asdfThisDoesNotExistASDF";
		const rangeError = new RangeError("Invalid settings key " + invalidSettingsKey);
		assertThrows(() => C_Settings.getValue(invalidSettingsKey), rangeError);
	});
});
