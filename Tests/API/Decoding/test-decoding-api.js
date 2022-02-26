describe("canDecodeFile", () => {
	it("should return true for any of the officially supported image formats", () => {
		assertTrue(C_Decoding.canDecodeFile("test.bmp"));
		assertTrue(C_Decoding.canDecodeFile("test.jpg"));
		assertTrue(C_Decoding.canDecodeFile("test.jpeg"));
		assertTrue(C_Decoding.canDecodeFile("test.png"));
	});
});
