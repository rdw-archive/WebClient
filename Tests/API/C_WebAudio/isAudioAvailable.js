describe("isAudioAvailable", () => {
	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.isAudioAvailable, "function");
	});

	it("should return true after the audio engine was initialized", () => {
		// This may only fail if the audio engine isn't yet initialized or some WebAudio issues occur
		// It's probably best to just permanently test it to be sure it always work
		assertTrue(C_WebAudio.isAudioAvailable());
	});
});
