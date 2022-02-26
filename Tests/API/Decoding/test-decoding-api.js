describe("canDecodeFile", () => {
	it("should return true for any of the officially supported image formats", () => {
		assertTrue(C_Decoding.canDecodeFile("test.bmp"));
		assertTrue(C_Decoding.canDecodeFile("test.jpg"));
		assertTrue(C_Decoding.canDecodeFile("test.jpeg"));
		assertTrue(C_Decoding.canDecodeFile("test.png"));
	});
});

describe("decodeFile", () => {
	it("should raise an error if the file type is not supported", () => {
		const fileName = new UniqueID().toString() + ".asdf";

		// Setup
		assertFalse(C_FileSystem.fileExists(fileName));
		C_FileSystem.writeJSON(fileName, {});
		assertTrue(C_FileSystem.fileExists(fileName));

		const expectedError = new Error("Cannot decode " + fileName + " (file type ASDF is not supported)");
		assertThrows(() => C_Decoding.decodeFile(fileName), expectedError);

		// Teardown
		C_FileSystem.removeFile(fileName);
		assertFalse(C_FileSystem.fileExists(fileName));
	});

	it("should raise an error if the given path is invalid", () => {
		const fileName = new UniqueID().toString() + ".asdf";
		assertFalse(C_FileSystem.fileExists(fileName)); // Just making sure...

		const expectedError = new Error("Cannot decode " + fileName + " (No such file exists)");
		assertThrows(() => C_Decoding.decodeFile(fileName), expectedError);
	});
});
