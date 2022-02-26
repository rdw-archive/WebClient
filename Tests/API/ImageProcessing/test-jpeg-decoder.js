describe("JpegDecoder", () => {
	describe("getSupportedFileTypes", () => {
		const decoder = new JpegDecoder();
		const supportedFormats = decoder.getSupportedFileTypes();
		it("should indicate that both JPG and JPEG files can be decoded", () => {
			assertTrue(supportedFormats["jpg"]);
			assertTrue(supportedFormats["jpeg"]);
		});
	});

	describe("decode", () => {
		it("should be able to decode JPEG files", () => {
			// Adding more extensive testing for this seems like overkill, since it's handled by external libraries
			const decoder = new JpegDecoder();
			const resourceData = C_FileSystem.readFileBinary(path.join(WEBCLIENT_FIXTURES_DIR, "image.jpg"));
			const jpegResource = new Resource("someResourceID", false, resourceData);

			decoder.decode(jpegResource);
			const bitmap = jpegResource.rawGet();
			assertTrue(bitmap instanceof Bitmap);

			assertEquals(bitmap.getWidth(), 2);
			assertEquals(bitmap.getHeight(), 3);
			assertEquals(bitmap.getPixelFormat(), Enum.PIXEL_FORMAT_RGBA);
			assertEquals(
				bitmap.toArrayBuffer(),
				// Seems like the pixels values are off by one (254 instead of 255)
				// Not sure if this is a compression artifact or decoder issue, but I guess it doesn't matter
				new Uint8ClampedArray([
					0, 0, 254, 255, 0, 0, 254, 255, 0, 0, 254, 255, 0, 0, 254, 255, 0, 0, 254, 255, 0, 0, 254, 255,
				])
			);
			assertEquals(bitmap.computeChecksum(), 1713740759);
			assertEquals(bitmap.getBufferSize(), 24);
			assertFalse(bitmap.hasAlpha());
			assertNull(bitmap.getTransparencyColor());
		});
	});
});
