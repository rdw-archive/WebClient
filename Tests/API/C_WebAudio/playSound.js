describe("playSound", () => {
	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.playSound, "function");
	});
});
