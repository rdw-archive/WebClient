describe("BuiltinJsonDecoder", () => {
	const decoder = new BuiltinJsonDecoder();
	it("should be exported into the global environment", () => {
		assertEquals(decoder.constructor.name, "BuiltinJsonDecoder");
	});

	const exportedApiSurface = ["getSupportedFileTypes", "decode"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof decoder[namedExport], "function");
		});
	});

	const supportedFormats = decoder.getSupportedFileTypes();
	it("should indicate that JSON files can be decoded", () => {
		assertTrue(supportedFormats["json"]);
	});
});
