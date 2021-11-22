describe("setEffectsVolume", () => {
	beforeEach(() => (C_WebAudio.originalVolumeGain = C_WebAudio.getEffectsVolume()));

	const path = require("path");
	const someMusicFile = path.join(WEBCLIENT_FIXTURES_DIR, "WebAudio", "dumbo.ogg");

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.setEffectsVolume, "function");
	});

	it("should be able to set the volume of the SFX track", () => {
		const previousVolumeGain = C_WebAudio.getEffectsVolume();
		const newVolumeGain = 0.1234567;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		C_WebAudio.setEffectsVolume(newVolumeGain);
		assertApproximatelyEquals(C_WebAudio.getEffectsVolume(), newVolumeGain);
	});

	// Internally, BabylonJS appears to convert negative master gain values to positive ones
	// Since that seems counter-intuitive and weird, we simply disallow it
	it("should throw a RangeError when the volume level is negative", () => {
		const previousVolumeGain = C_WebAudio.getEffectsVolume();
		const newVolumeGain = -0.1234567;

		// Just to be safe (it's unlikely to ever trigger)
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		const expectedError = new RangeError(C_WebAudio.ERROR_NEGATIVE_VOLUME_GAIN);
		assertThrows(() => C_WebAudio.setEffectsVolume(newVolumeGain), expectedError);
	});

	it("should apply the volume level to existing audio sources on the track", () => {
		const audioSource = new AudioSource(someMusicFile);
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_SFX);
		const soundHandleID = musicTrack.addAudioSource(audioSource);

		const previousVolumeGain = C_WebAudio.getEffectsVolume();
		const newVolumeGain = 0.5247;

		assertEquals(audioSource.getVolume(), previousVolumeGain);
		C_WebAudio.setEffectsVolume(newVolumeGain);
		assertEquals(audioSource.getVolume(), newVolumeGain);

		musicTrack.removeAudioSource(soundHandleID);
	});

	it("should apply the volume level to newly-created audio sources on the track", () => {
		const audioSource = new AudioSource(someMusicFile);
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_SFX);

		const previousVolumeGain = C_WebAudio.getEffectsVolume();
		const newVolumeGain = 0.87483;

		// Just to be safe
		assertNotApproximatelyEquals(previousVolumeGain, newVolumeGain);

		C_WebAudio.setEffectsVolume(newVolumeGain);

		// It should use 1 by default, or at least something different from the arbitrary new volume gain defined here
		// So this SHOULD test that the new volume hasn't yet been applied, regardless of what the current one is
		assertNotEquals(audioSource.getVolume(), newVolumeGain);
		const soundHandleID = musicTrack.addAudioSource(audioSource);
		assertEquals(audioSource.getVolume(), newVolumeGain);

		musicTrack.removeAudioSource(soundHandleID);
	});

	// Cleanup: Restore the previous gain level so as to not mess up other tests
	afterEach(() => {
		C_WebAudio.setEffectsVolume(C_WebAudio.originalVolumeGain);
	});

	after(() => delete C_WebAudio.originalVolumeGain);
});
