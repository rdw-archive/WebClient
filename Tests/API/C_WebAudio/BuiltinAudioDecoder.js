describe("BuiltinAudioDecoder", () => {
	const decoder = new BuiltinAudioDecoder();
	it("should be exported into the global environment", () => {
		assertEquals(decoder.constructor.name, "BuiltinAudioDecoder");
	});

	const exportedApiSurface = ["getSupportedFileTypes", "decode"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof decoder[namedExport], "function");
		});
	});

	const supportedFormats = decoder.getSupportedFileTypes();
	it("should indicate that MP3 files can be decoded", () => {
		assertTrue(supportedFormats["mp3"]);
	});

	it("should indicate that OGG files can be decoded", () => {
		assertTrue(supportedFormats["ogg"]);
	});

	it("should indicate that WAV files can be decoded", () => {
		assertTrue(supportedFormats["wav"]);
	});
});
