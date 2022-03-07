describe("BmpDecoder", () => {
	describe("getSupportedFileTypes", () => {
		const decoder = new BmpDecoder();
		const supportedFormats = decoder.getSupportedFileTypes();
		it("should indicate that BMP files can be decoded", () => {
			assertTrue(supportedFormats["bmp"]);
		});
	});

	describe("decode", () => {
		it("should be able to decode bitmaps with a color depth of 8 bit with padded rows", () => {
			const decoder = new BmpDecoder();
			const resourceData = C_FileSystem.readFileBinary(
				path.join(WEBCLIENT_FIXTURES_DIR, "8bpp-image-without-alpha.bmp")
			);
			const bmpResource = new Resource("someResourceID", false, resourceData);

			assertFalse(bmpResource.rawGet() instanceof BMP);
			decoder.decode(bmpResource);

			const bitmap = bmpResource.rawGet();
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

		it("should be able to decode bitmaps with a color depth of 24 bit with padded rows", () => {
			const decoder = new BmpDecoder();
			const resourceData = C_FileSystem.readFileBinary(path.join(WEBCLIENT_FIXTURES_DIR, "24bpp-image.bmp"));
			const bmpResource = new Resource("someResourceID", false, resourceData);

			assertFalse(bmpResource.rawGet() instanceof Bitmap);
			decoder.decode(bmpResource);

			const bitmap = bmpResource.rawGet();
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

		it("should be able to decode byte-aligned BMP files with zero padding at the end", () => {
			const bmpPath = path.join(WEBCLIENT_FIXTURES_DIR, "byte-aligned-with-zero-padding-eof.bmp");
			const bmpResource = C_Decoding.decodeFile(bmpPath);

			const bitmap = bmpResource.rawGet();
			assertEquals(bitmap.getWidth(), 3);
			assertEquals(bitmap.getHeight(), 3);
			assertEquals(bitmap.computeChecksum(), 4148883029);
		});
	});
});
