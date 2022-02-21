class BMP {
	constructor() {
		this.width = 0;
		this.height = 0;

		this.dataOffset = 0;
		this.compressionMode = 0;
		this.compressedFileSizeInBytes = 0;
		this.decompressedFileSizeInBytes = 0;
		this.pixelsPerMeterU = 0;
		this.pixelsPerMeterV = 0;
		this.numPaddingBytesPerRow = 0;
		this.numImportantColors = 0;

		this.colorTable = [];

		this.pixelBuffer = [];
		this.pixelFormat = Enum.PIXEL_FORMAT_RGBA;

		this.reader = null;
	}
	load(buffer) {
		this.reader = new BinaryReader(buffer);

		this.parseHeader();
		this.parseColorTable();

		if (this.dataOffset !== this.reader.offset) {
			// Fast-forwarding to the pixel data to skip the optional Gap1 portion of the file header
			WARNING("Data offset " + this.dataOffset + " doesn't match reader offset " + this.reader.offset);
			this.reader.offset = this.dataOffset;
		}

		this.parsePixelData();

		if (!this.reader.hasReachedEOF())
			throw new Error("Detected leftover bytes at the end of the structure - that doesn't seem right!");

		delete this.reader;
	}
	parseHeader() {
		const reader = this.reader;

		const signature = reader.getString(2);
		const expectedSignature = Bitmap.MAGIC_HEADER;
		if (signature !== expectedSignature)
			throw new Error("Invalid signature " + signature + "detected ('" + expectedSignature + "' expected)");

		this.compressedFileSizeInBytes = reader.getUint32();
		const reserved = reader.getUint32(); // Is this ever used? Guess not...
		this.dataOffset = reader.getUint32();

		const infoHeaderSize = reader.getUint32();
		if (infoHeaderSize !== 40) throw new Error("Header size is " + infoHeaderSize + " (should always be 40)");

		const width = reader.getInt32();
		const height = reader.getInt32();
		if (height < 0) throw new Error("Top-down bitmaps are not currently supported");

		this.width = width;
		this.height = height;

		const numPlanes = reader.getUint16();
		if (numPlanes !== 1)
			throw new Error("Number of planes is " + numPlanes + " (must always be 1 as per the BMP specification)");

		this.bitsPerPixel = reader.getUint16();
		if (this.bitsPerPixel !== 8 && this.bitsPerPixel !== 24)
			throw new Error(
				"Detected bitmap with color depth " +
					this.bitsPerPixel +
					" bpp (only bitmaps with a color depth of 8 or 24 bits per pixel are currently supported"
			);

		this.compressionMode = reader.getUint32();
		if (this.compressionMode !== 0) throw new Error("BMP compression is not currenty supported");

		this.decompressedFileSizeInBytes = reader.getUint32();
		this.pixelsPerMeterU = reader.getUint32();
		this.pixelsPerMeterV = reader.getUint32();
		this.numColorsUsed = reader.getUint32();
		this.numImportantColors = reader.getUint32();

		const bytesPerPixel = this.bitsPerPixel / 8;
		this.numPaddingBytesPerRow = (width * bytesPerPixel) % 4; // (width * channels) % 4 ?
	}
	parseColorTable() {
		if (this.bitsPerPixel > 8) return;

		const reader = this.reader;

		const colorTable = [];

		for (let tableIndex = 0; tableIndex < this.numColorsUsed; tableIndex++) {
			const blue = reader.getUint8();
			const green = reader.getUint8();
			const red = reader.getUint8();
			const reserved = reader.getUint8();

			if (reserved !== 0)
				throw new Error("Reserved palette alpha is " + reserved + " (bitmap transparency is not currently supported");

			const color = new Color(red, green, blue, 255);
			colorTable.push(color);
		}

		this.colorTable = colorTable;
	}
	parsePixelData() {
		const reader = this.reader;
		const width = this.width;
		const height = this.height;
		const colorTable = this.colorTable;

		let pixelData = new Uint8ClampedArray(width * height * 4);

		const paddingBytes = [];
		let paletteIndices = [];
		for (let pixelV = 0; pixelV < height; pixelV += 1) {
			for (let pixelU = 0; pixelU < width + this.numPaddingBytesPerRow; pixelU += 1) {
				if (pixelU < width) {
					// Actual pixel data and not padding bytes, which we ignore
					// Pixel format: BGR (no alpha since it's 24bit, and not 32)
					if (this.bitsPerPixel === 24) {
						const blue = reader.getUint8();
						const green = reader.getUint8();
						const red = reader.getUint8();
						const alpha = 255;

						const pixelIndex = pixelU + pixelV * width;
						const pixelOffset = pixelIndex * 4; // RGBA = 4 bytes per pixel
						// Output format: Always RGBA (engine-level convention)
						pixelData[pixelOffset + 0] = red;
						pixelData[pixelOffset + 1] = green;
						pixelData[pixelOffset + 2] = blue;
						pixelData[pixelOffset + 3] = alpha;
					}

					if (this.bitsPerPixel === 8) {
						// 256-color bitmap: Each byte represents a single pixel, described as palette index
						let paletteIndex = reader.getUint8();
						paletteIndices.push(paletteIndex);

						if (paletteIndex > colorTable.length) {
							throw new Error(
								"Palette index is " + paletteIndex + "but there are only" + colorTable.length + " palette entries"
							);
						}

						let color = colorTable[paletteIndex];

						const pixelIndex = pixelU + pixelV * width;
						const pixelOffset = pixelIndex * 4; // RGBA = 4 bytes per pixel
						// Output format: Always RGBA (engine-level convention)
						pixelData[pixelOffset + 0] = color.red;
						pixelData[pixelOffset + 1] = color.green;
						pixelData[pixelOffset + 2] = color.blue;
						pixelData[pixelOffset + 3] = color.alpha;
					}
				} else {
					// Padding bytes can safely be discarded, but for debugging purposes we'll temporarily store them here
					paddingBytes.push(reader.getUint8());
				}
			}
		}

		this.pixelBuffer = pixelData;
	}
	toBitmap() {
		return new Bitmap(this.pixelBuffer, this.width, this.height, Enum.PIXEL_FORMAT_RGBA);
	}
}
