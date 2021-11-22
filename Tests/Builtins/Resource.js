describe("Resource", () => {
	const resource = new Resource();
	it("should be exported into the global environment", () => {
		assertEquals(resource.constructor.name, "Resource");
	});

	let exportedApiSurface = ["isReady", "toArrayBuffer", "touch"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof resource[namedExport], "function");
		});
	});
});
