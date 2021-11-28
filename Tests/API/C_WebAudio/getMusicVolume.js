describe("getMusicVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getMusicVolume()));

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.getMusicVolume, "function");
	});

	it("should be able to retrieve the volume of the Music track", () => {
		const newVolumeGain = 0.5;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(C_WebAudio.getMusicVolume(), newVolumeGain);

		C_WebAudio.setMusicVolume(newVolumeGain);
		assertEquals(C_WebAudio.getMusicVolume(), newVolumeGain);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setMusicVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
