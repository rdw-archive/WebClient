describe("getTrackInfo", () => {
	it("should throw a TypeError if no track ID was passed", () => {
		const expectedError = new TypeError("Usage: getTrackInfo(String trackID)");
		assertThrows(() => C_WebAudio.getTrackInfo(), expectedError);
	});

	it("should throw a TypeError if no track ID was passed", () => {
		const expectedError = new TypeError("Usage: getTrackInfo(String trackID)");
		assertThrows(() => C_WebAudio.getTrackInfo(), expectedError);
	});

	it("should throw a RangeError if an invalid track ID was passed", () => {
		const trackID = "doesNotExist";
		const expectedError = new RangeError(C_WebAudio.ERROR_INVALID_TRACK_ID + ": " + trackID);

		assertThrows(() => C_WebAudio.getTrackInfo(trackID), expectedError);
	});

	// valid track, get AudioTrack instance, same as before
});

// TODO Review setup/teardown, should be stateless
