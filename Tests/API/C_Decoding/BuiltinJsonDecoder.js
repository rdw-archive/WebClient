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

	describe("decode", () => {
		it("should be able to decode buffer representations of a JSON string", () => {
			const resource = new Resource(new UniqueID().toString());

			const textEncoder = new TextEncoder();
			const jsonString = JSON.stringify({ test: 42 });
			const jsonBytes = textEncoder.encode(jsonString);

			resource.rawSet(jsonBytes);

			decoder.decode(resource);

			assertEquals(resource.rawGet(), { test: 42 });
		});
	});
});
