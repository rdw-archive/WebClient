describe("getTrackVolume", () => {
	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.setTrackVolume, "function");
	});

	const expectedErrorMessage = "Usage: getTrackVolume(String trackID)";
	const typeError = new TypeError(expectedErrorMessage);
	it("should throw a TypeError if no track ID was passed", () => {
		assertThrows(() => C_WebAudio.getTrackVolume(), typeError);
	});

	it("should throw a RangeError if an invalid track ID was passed", () => {
		const invalidTrackID = "12q4rrwdftyu";
		const expectedError = RangeError(C_WebAudio.ERROR_INVALID_TRACK_ID + ": " + invalidTrackID);

		assertThrows(() => C_WebAudio.getTrackInfo(invalidTrackID), expectedError); // Just making sure
		assertThrows(() => C_WebAudio.getTrackVolume(invalidTrackID), expectedError);
	});
});
