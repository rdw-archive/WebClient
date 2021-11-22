describe("Resource", () => {
	const data = new ArrayBuffer(12);

	const originalBuffer = new DataView(data);
	originalBuffer.setUint32(0, 42);
	originalBuffer.setUint32(4, 43);
	originalBuffer.setUint32(8, 44);

	const resource = new Resource("resourceID", false, data);

	it("should be exported into the global environment", () => {
		assertEquals(resource.constructor.name, "Resource");
	});

	let exportedApiSurface = ["isReady", "toArrayBuffer", "touch"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof resource[namedExport], "function");
		});
	});

	describe("toArrayBuffer", () => {
		const buffer = resource.toArrayBuffer();
		it("should return an object of type ArrayBuffer", () => {
			assertEquals(buffer.constructor.name, "ArrayBuffer");
		});

		it("should return a copy of the data stored in its internal buffer", () => {
			const reader = new DataView(buffer);
			assertEquals(reader.getUint32(0), originalBuffer.getUint32(0));
			assertEquals(reader.getUint32(4), originalBuffer.getUint32(4));
			assertEquals(reader.getUint32(8), originalBuffer.getUint32(8));
		});

		it("should return a copy of its internal buffer and not the original", () => {
			// Since we can't directly check for equality with buffers, modify the copy to see if it affects the original
			const copiedBuffer = new DataView(buffer);
			copiedBuffer.setUint32(0, 123);
			copiedBuffer.setUint32(4, 234);
			copiedBuffer.setUint32(8, 567);

			assertNotEquals(copiedBuffer.getUint32(0), originalBuffer.getUint32(0));
			assertNotEquals(copiedBuffer.getUint32(4), originalBuffer.getUint32(4));
			assertNotEquals(copiedBuffer.getUint32(8), originalBuffer.getUint32(8));
		});
	});
});
