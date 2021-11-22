// todo mute music before all tests that may produce sound
describe("stopMusic", () => {
	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.stopMusic, "function");
	});

	it("should do nothing if no music is currently playing", () => {
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC);
		assertEquals(musicTrack.getNumActiveVoices(), 0);
		assertEquals(musicTrack.getNumAudioSources(), 0);
		C_WebAudio.stopMusic();
		assertEquals(musicTrack.getNumActiveVoices(), 0);
		assertEquals(musicTrack.getNumAudioSources(), 0);
	});
});
