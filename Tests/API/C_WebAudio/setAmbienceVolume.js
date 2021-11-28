describe("setAmbienceVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getAmbienceVolume()));

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.setAmbienceVolume, "function");
	});

	it("should be able to set the volume of the Ambience track", () => {
		const previousVolumeGain = C_WebAudio.getAmbienceVolume();
		const newVolumeGain = 0.1234567;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		C_WebAudio.setAmbienceVolume(newVolumeGain);
		assertApproximatelyEquals(C_WebAudio.getAmbienceVolume(), newVolumeGain);
	});

	// Internally, BabylonJS appears to convert negative master gain values to positive ones
	// Since that seems counter-intuitive and weird, we simply disallow it
	it("should throw a RangeError when the volume level is negative", () => {
		const previousVolumeGain = C_WebAudio.getAmbienceVolume();
		const newVolumeGain = -0.1234567;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		const expectedError = new RangeError(C_WebAudio.ERROR_NEGATIVE_VOLUME_GAIN);
		assertThrows(() => C_WebAudio.setAmbienceVolume(newVolumeGain), expectedError);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setAmbienceVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
