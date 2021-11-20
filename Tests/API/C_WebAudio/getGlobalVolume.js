describe("getGlobalVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getGlobalVolume()));

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.getGlobalVolume, "function"); // tbd rename master to global?
	});

	it("should be able to retrieve the global volume of the audio engine", () => {
		const newVolumeGain = 0.5;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(C_WebAudio.getGlobalVolume(), newVolumeGain);

		C_WebAudio.setGlobalVolume(newVolumeGain);
		assertEquals(C_WebAudio.getGlobalVolume(), newVolumeGain);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setGlobalVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
