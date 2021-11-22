describe("setAmbienceVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getAmbienceVolume()));

	const path = require("path");
	const someMusicFile = path.join(WEBCLIENT_FIXTURES_DIR, "WebAudio", "dumbo.ogg");

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

	it("should apply the volume level to existing audio sources on the track", () => {
		const audioSource = new AudioSource(someMusicFile);
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_AMBIENCE);
		const soundHandleID = musicTrack.addAudioSource(audioSource);

		const previousVolumeGain = C_WebAudio.getAmbienceVolume();
		const newVolumeGain = 0.5247;

		assertEquals(audioSource.getVolume(), previousVolumeGain);
		C_WebAudio.setAmbienceVolume(newVolumeGain);
		assertEquals(audioSource.getVolume(), newVolumeGain);

		musicTrack.removeAudioSource(soundHandleID);
	});

	it("should apply the volume level to newly-created audio sources on the track", () => {
		const audioSource = new AudioSource(someMusicFile);
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_AMBIENCE);

		const previousVolumeGain = C_WebAudio.getAmbienceVolume();
		const newVolumeGain = 0.87483;

		// Just to be safe
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		C_WebAudio.setAmbienceVolume(newVolumeGain);

		// It should use 1 by default, or at least something different from the arbitrary new volume gain defined here
		// So this SHOULD test that the new volume hasn't yet been applied, regardless of what the current one is
		assertNotEquals(audioSource.getVolume(), newVolumeGain);
		const soundHandleID = musicTrack.addAudioSource(audioSource);
		assertEquals(audioSource.getVolume(), newVolumeGain);

		musicTrack.removeAudioSource(soundHandleID);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setAmbienceVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
