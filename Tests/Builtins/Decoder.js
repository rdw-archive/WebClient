describe("Decoder", () => {
	const decoder = new Decoder();
	it("should be exported into the global environment", () => {
		assertEquals(decoder.constructor.name, "Decoder");
	});

	let exportedApiSurface = ["getSupportedFileTypes", "decode"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof decoder[namedExport], "function");
		});
	});

	// Since this is just an interface that needs to be implemented, there's no implementation to test
});
