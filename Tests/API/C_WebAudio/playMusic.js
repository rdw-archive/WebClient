describe("playMusic", () => {
	// This should remove all existing audio sources that could be interfering with the tests
	beforeEach(() => C_WebAudio.stopMusic());
	afterEach(() => C_WebAudio.stopMusic());

	const path = require("path");

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.playMusic, "function");
	});

	const expectedErrorMessage = "Usage: C_WebAudio.playMusic(String filePath)";
	const typeError = new TypeError(expectedErrorMessage);
	it("should throw a TypeError if no file path was passed", () => {
		assertThrows(() => C_WebAudio.playMusic(), typeError);
	});

	it("should throw a TypeError if the file path is not a String", () => {
		const invalidValues = [
			42,
			[42],
			{ 42: 42 },
			() => {
				let there = "peace";
			},
			C_WebAudio,
		];

		invalidValues.forEach((invalidValue) => {
			assertThrows(() => C_WebAudio.playMusic(invalidValue), typeError);
		});
	});
});
