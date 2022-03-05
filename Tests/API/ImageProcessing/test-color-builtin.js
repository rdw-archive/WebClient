describe("Color", () => {
	describe("constructor", () => {
		it("should initialize the color depth to 8 bits per pixel", () => {
			const color = new Color(0, 0, 0, 255);
			assertEquals(color.getColorDepth(), 8);
		});

		it("should initialize the RGBA values with the given parameters", () => {
			const color = new Color(123, 234, 42, 255);
			assertEquals(color.red, 123);
			assertEquals(color.green, 234);
			assertEquals(color.blue, 42);
			assertEquals(color.alpha, 255);
		});

		it("should set the alpha value to 100% if none was given", () => {
			const color = new Color(0, 0, 0);
			assertEquals(color.alpha, 255); // 8 bpp is the default, so this is the max value
		});
	});

	describe("setColorDepth", () => {
		it("should adjust the RGBA values to match the color depth", () => {
			const color = new Color(255, 128, 64, 32);
			assertEquals(color.getColorDepth(), 8);

			color.setColorDepth(32);

			assertEquals(color.red, 1);
			assertEquals(color.green, 128 / 255);
			assertEquals(color.blue, 64 / 255);
			assertEquals(color.alpha, 32 / 255);
		});
	});

	describe("getColorDepth", () => {
		it("should return the current color depth after it has been changed", () => {
			const color = new Color(255, 128, 64, 32);

			assertNotEquals(color.getColorDepth(), 32);
			color.setColorDepth(32);
			assertEquals(color.getColorDepth(), 32);
		});
	});
});
