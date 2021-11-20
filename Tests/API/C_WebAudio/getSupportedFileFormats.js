describe("getSupportedFileFormats", () => {
	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.getSupportedFileFormats, "function");
	});

	const supportedFormats = C_WebAudio.getSupportedFileFormats();
	it("should indicate that MP3 is a supported file format", () => {
		// This may only fail if the audio engine isn't yet initialized or some WebAudio issues occur
		// It's probably best to just permanently test it to be sure it always work
		assertTrue(supportedFormats["mp3"]);
	});

	it("should indicate that OGG Vorbis is a supported file format", () => {
		// This may only fail if the audio engine isn't yet initialized or some WebAudio issues occur
		// It's probably best to just permanently test it to be sure it always work
		assertTrue(supportedFormats["ogg"]);
	});

	it("should indicate that WAV is a supported file format", () => {
		// This should always be true, as waveform (WAV) is the most basic format... but you never know?
		assertTrue(supportedFormats["wav"]);
	});
});
