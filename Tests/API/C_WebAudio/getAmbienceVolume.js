describe("getAmbienceVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getAmbienceVolume()));

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.getAmbienceVolume, "function"); // tbd rename master to global?
	});

	it("should be able to retrieve the volume of the Ambience track", () => {
		const newVolumeGain = 0.5;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(C_WebAudio.getAmbienceVolume(), newVolumeGain);

		C_WebAudio.setAmbienceVolume(newVolumeGain);
		assertEquals(C_WebAudio.getAmbienceVolume(), newVolumeGain);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setAmbienceVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
