describe("getEffectsVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getEffectsVolume()));

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.getEffectsVolume, "function");
	});

	it("should be able to retrieve the volume of the SFX track", () => {
		const newVolumeGain = 0.5;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(C_WebAudio.getEffectsVolume(), newVolumeGain);

		C_WebAudio.setEffectsVolume(newVolumeGain);
		assertEquals(C_WebAudio.getEffectsVolume(), newVolumeGain);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setEffectsVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
