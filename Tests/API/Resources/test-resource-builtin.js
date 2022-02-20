describe("Resource", () => {
	describe("toJSON", () => {
		it("should return a JSON representation of the raw resource data", () => {
			const resourceData = { test: 42 };
			const resource = new Resource("someID", false, resourceData);
			assertEquals(resource.toJSON(), resourceData);
		});
	});

	describe("rawGet", () => {
		it("should return the raw resource data without modifying its format", () => {
			const resourceData = { test: 42 };
			const resource = new Resource("someID", false, resourceData);
			assertEquals(resource.rawGet(), resourceData);
		});
	});

	describe("rawSet", () => {
		it("should set the raw resource data without modifying its format", () => {
			const oldResourceData = { test: 123 };
			const newResourceData = { test: 42 };
			const resource = new Resource("someID", false, oldResourceData);
			assertEquals(resource.rawGet(), oldResourceData);
			resource.rawSet(newResourceData);
			assertEquals(resource.rawGet(), newResourceData);
		});
	});
});
