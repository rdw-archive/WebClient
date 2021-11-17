describe("UniqueID", () => {
	it("should be exported into the global environment", () => {
		assertEquals(UniqueID.name, "UniqueID");
	});

	let exportedApiSurface = ["toString"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof UniqueID[namedExport], "function");
		});
	});
});
