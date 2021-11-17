describe("Assertions", () => {
	let exportedApiSurface = [
		"assertApproximatelyEquals",
		"assertNotApproximatelyEquals",
		"assertTrue",
		"assertDeepEquals",
		"assertFalse",
		"assertEquals",
		"assertNotEquals",
		"assertUndefined",
		"assertThrows",
		"assertTypeOf",
	];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof window[namedExport], "function");
		});
	});
});
