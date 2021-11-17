describe("Validators", () => {
	let exportedApiSurface = ["validateString", "validateNumber"];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof window[namedExport], "function");
		});
	});
});
