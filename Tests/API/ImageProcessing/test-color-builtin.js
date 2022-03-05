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

	it("should export the most commonly-used RGBA presets as human-readable shorthands", () => {
		// This definitely needs an overhaul, but for now we can settle for 8bit colors
		const magentaColor = Color.MAGENTA;
		assertEquals(magentaColor.red, 255);
		assertEquals(magentaColor.green, 0);
		assertEquals(magentaColor.blue, 255);
		assertEquals(magentaColor.alpha, 255);

		const redColor = Color.RED;
		assertEquals(redColor.red, 255);
		assertEquals(redColor.green, 0);
		assertEquals(redColor.blue, 0);
		assertEquals(redColor.alpha, 255);

		const greenColor = Color.GREEN;
		assertEquals(greenColor.red, 0);
		assertEquals(greenColor.green, 255);
		assertEquals(greenColor.blue, 0);
		assertEquals(greenColor.alpha, 255);

		const blueColor = Color.BLUE;
		assertEquals(blueColor.red, 0);
		assertEquals(blueColor.green, 0);
		assertEquals(blueColor.blue, 255);
		assertEquals(blueColor.alpha, 255);

		const blackColor = Color.BLACK;
		assertEquals(blackColor.red, 0);
		assertEquals(blackColor.green, 0);
		assertEquals(blackColor.blue, 0);
		assertEquals(blackColor.alpha, 255);

		const whiteColor = Color.WHITE;
		assertEquals(whiteColor.red, 255);
		assertEquals(whiteColor.green, 255);
		assertEquals(whiteColor.blue, 255);
		assertEquals(whiteColor.alpha, 255);
	});
});
