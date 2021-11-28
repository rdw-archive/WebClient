describe("AudioTrack", () => {
	it("should be exported into the global environment", () => {
		assertEquals(typeof AudioTrack.constructor, "function");
	});
});
