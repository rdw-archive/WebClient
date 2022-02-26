describe("Aliases", () => {
	const exportedObjects = ["BABYLON", "JPEGJS", "JOI", "MESSAGEPACK", "NODE", "UPNG", "UUID"];
	const exportedFunctions = ["dump", "printf"];

	exportedObjects.forEach((namedExport) => {
		it("should export global object " + namedExport, () => {
			assertEquals(typeof window[namedExport], "object");
		});
	});

	exportedFunctions.forEach((namedExport) => {
		it("should export global function " + namedExport, () => {
			assertEquals(typeof window[namedExport], "function");
		});
	});
});
