describe("setTrackVolume", () => {
	const customTrackID = "MyCustomTrack";
	const newTrack = C_WebAudio.createTrack(customTrackID);

	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getTrackVolume(customTrackID)));

	const path = require("path");
	const someMusicFile = path.join(WEBCLIENT_FIXTURES_DIR, "WebAudio", "dumbo.ogg");

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.setTrackVolume, "function");
	});

	it("should be able to set the volume of a custom track", () => {
		const previousVolumeGain = C_WebAudio.getTrackVolume(customTrackID);
		const newVolumeGain = 0.252636;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		C_WebAudio.setTrackVolume(customTrackID, newVolumeGain);
		assertApproximatelyEquals(C_WebAudio.getTrackVolume(customTrackID), newVolumeGain);
	});

	// Internally, BabylonJS appears to convert negative master gain values to positive ones
	// Since that seems counter-intuitive and weird, we simply disallow it
	it("should throw a RangeError when the volume level is negative", () => {
		const previousVolumeGain = C_WebAudio.getTrackVolume(customTrackID);
		const newVolumeGain = -0.96958;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		const expectedError = new RangeError(C_WebAudio.ERROR_NEGATIVE_VOLUME_GAIN);
		assertThrows(() => C_WebAudio.setTrackVolume(customTrackID, newVolumeGain), expectedError);
	});

	it("should apply the volume level to existing audio sources on the track", () => {
		const audioSource = new AudioSource(someMusicFile);
		const customTrack = C_WebAudio.getTrackInfo(customTrackID);
		const soundHandleID = customTrack.addAudioSource(audioSource);

		const previousVolumeGain = C_WebAudio.getTrackVolume(customTrackID);
		const newVolumeGain = 0.47478;

		assertEquals(audioSource.getVolume(), previousVolumeGain);
		C_WebAudio.setTrackVolume(customTrackID, newVolumeGain);
		assertEquals(audioSource.getVolume(), newVolumeGain);

		customTrack.removeAudioSource(soundHandleID);
	});

	it("should apply the volume level to newly-created audio sources on the track", () => {
		const audioSource = new AudioSource(someMusicFile);
		const customTrack = C_WebAudio.getTrackInfo(customTrackID);

		const previousVolumeGain = C_WebAudio.getTrackVolume(customTrackID);
		const newVolumeGain = 0.21314;

		// Just to be safe
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		C_WebAudio.setTrackVolume(customTrackID, newVolumeGain);

		// It should use 1 by default, or at least something different from the arbitrary new volume gain defined here
		// So this SHOULD test that the new volume hasn't yet been applied, regardless of what the current one is
		assertNotEquals(audioSource.getVolume(), newVolumeGain);
		const soundHandleID = customTrack.addAudioSource(audioSource);
		assertEquals(audioSource.getVolume(), newVolumeGain);

		customTrack.removeAudioSource(soundHandleID);
	});

	const expectedErrorMessage = "Usage: setTrackVolume(String trackID, Number volumeGain)";
	const typeError = new TypeError(expectedErrorMessage);
	it("should throw a TypeError if no track ID was passed", () => {
		assertThrows(() => C_WebAudio.setTrackVolume(), typeError);
	});

	it("should throw a TypeError if no volume gain was passed", () => {
		assertThrows(() => C_WebAudio.setTrackVolume(customTrackID), typeError);
	});

	it("should throw a TypeError if the track ID is not a String", () => {
		// TODO: DRY, move to fixtures
		const invalidTrackIDs = [
			42,
			[42],
			NaN,
			{ 42: 42 },
			() => {
				let there = "peace";
			},
			C_WebAudio,
		];

		invalidTrackIDs.forEach((invalidTrackID) => {
			assertThrows(() => C_WebAudio.setTrackVolume(invalidTrackID, 0.25), typeError);
		});
	});

	it("should throw a TypeError if the volume gain is not a number", () => {
		const invalidVolumeGains = [
			"42",
			NaN,
			[42],
			{ 42: 42 },
			() => {
				let there = "peace";
			},
			C_WebAudio,
		];

		invalidVolumeGains.forEach((invalidVolumeGain) => {
			assertThrows(() => C_WebAudio.setTrackVolume(customTrackID, invalidVolumeGain), typeError);
		});
	});

	it("should throw a TypeError if no audio track with the given track ID exists", () => {
		const invalidTrackID = "DoesNotExistProbably";
		const expectedError = new RangeError(C_WebAudio.ERROR_INVALID_TRACK_ID + ": " + invalidTrackID);
		assertThrows(() => C_WebAudio.setTrackVolume(invalidTrackID, 0.27), expectedError);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setTrackVolume(customTrackID, C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
