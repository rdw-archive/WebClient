describe("createTrack", () => {
	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.createTrack, "function");
	});
	it("should create a new audio channel if the track ID is still available", () => {
		const trackID = "<Some track ID>";
		const expectedError = new RangeError(C_WebAudio.ERROR_INVALID_TRACK_ID + ": " + trackID);
		assertThrows(() => C_WebAudio.getTrackInfo(trackID), expectedError); // Just making sure

		const channel = C_WebAudio.createTrack(trackID);
		assertTypeOf(channel, "AudioTrack");
	});

	const expectedErrorMessage = "Usage: createTrack(String trackID)";
	const typeError = new TypeError(expectedErrorMessage);
	it("should throw a TypeError if no track ID was passed", () => {
		assertThrows(() => C_WebAudio.createTrack(), typeError);
	});

	it("should throw a TypeError if the track ID is not a String", () => {
		// TODO: DRY, move to fixtures
		const invalidtrackIDs = [
			42,
			[42],
			{ 42: 42 },
			() => {
				let there = "peace";
			},
			C_WebAudio,
		];

		invalidtrackIDs.forEach((invalidtrackID) => {
			assertThrows(() => C_WebAudio.createTrack(invalidtrackID), typeError);
		});
	});

	it("should return the existing channel if the track ID is already in use", () => {
		const trackID = "<Some other track ID>";
		const expectedError = new RangeError(C_WebAudio.ERROR_INVALID_TRACK_ID + ": " + trackID);
		assertThrows(() => C_WebAudio.getTrackInfo(trackID), expectedError); // Just making sure

		const channel = C_WebAudio.createTrack(trackID);
		assertTypeOf(channel, "AudioTrack");

		const shouldBeTheSameChannel = C_WebAudio.createTrack(trackID);
		assertTypeOf(shouldBeTheSameChannel, "AudioTrack");
		assertDeepEquals(shouldBeTheSameChannel, channel);
	});
});

// TODO: Cleanup - remove all the channels
