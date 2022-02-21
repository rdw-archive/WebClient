describe("PngDecoder", () => {
	describe("getSupportedFileTypes", () => {
		const decoder = new PngDecoder();
		const supportedFormats = decoder.getSupportedFileTypes();
		it("should indicate that PNG files can be decoded", () => {
			assertTrue(supportedFormats["png"]);
		});
	});

	describe("decode", () => {
		it("should be able to decode PNG files", () => {
			// Adding more extensive testing for this seems like overkill, since it's handled by external libraries
			const decoder = new PngDecoder();
			const resourceData = C_FileSystem.readFileBinary(path.join(WEBCLIENT_FIXTURES_DIR, "image.png"));
			const pngResource = new Resource("someResourceID", false, resourceData);

			decoder.decode(pngResource);
			const bitmap = pngResource.rawGet();
			assertTrue(bitmap instanceof Bitmap);

			assertEquals(bitmap.getWidth(), 2);
			assertEquals(bitmap.getHeight(), 3);
			assertEquals(bitmap.getPixelFormat(), Enum.PIXEL_FORMAT_RGBA);
			assertEquals(
				bitmap.toArrayBuffer(),
				new Uint8ClampedArray([
					0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255,
				])
			);
			assertEquals(bitmap.computeChecksum(), 1054155098);
			assertEquals(bitmap.getBufferSize(), 24);
			assertFalse(bitmap.hasAlpha());
			assertNull(bitmap.getTransparencyColor());
		});
	});
});
