describe("BinaryReader", () => {
	describe("hasReachedEOF", () => {
		it("should return false if the internal buffer still has unread bytes", () => {
			const buffer = new ArrayBuffer(8);
			const reader = new BinaryReader(buffer);
			const whatever = reader.getUint32();
			assertFalse(reader.hasReachedEOF());
		});

		it("should return true if the internal buffer has been consumed", () => {
			const buffer = new ArrayBuffer(4);
			const reader = new BinaryReader(buffer);
			const whatever = reader.getUint32();
			assertTrue(reader.hasReachedEOF());
		});
	});
});
