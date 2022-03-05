class Bitmap {
	static MAGIC_HEADER = "BM";
	constructor(pixelData, width = 0, height = 0, pixelFormat = Enum.PIXEL_FORMAT_RGBA) {
		if (!pixelData) pixelData = new Uint8ClampedArray(width * height * 4);

		this.pixelData = pixelData;
		this.width = width;
		this.height = height;

		this.pixelFormat = pixelFormat;
		this.bytesPerPixel = 4; // We always store the RGBA values for each pixel

		this.transparencyColor = null;
	}
	flipHorizontally(pixelData = this.pixelData, imageWidth = this.width, imageHeight = this.height) {
		let flippedPixelData = [];
		for (let row = 1; row <= imageHeight; row++) {
			// Swap this row with the one on the other end of the image (and map indices from 1 to 0)
			for (let column = 1; column <= imageWidth; column++) {
				let pixelIndex = (row - 1) * imageWidth + column - 1;
				let pixelOffset = pixelIndex * 4;

				let red = pixelData[pixelOffset + 0];
				let green = pixelData[pixelOffset + 1];
				let blue = pixelData[pixelOffset + 2];
				let alpha = pixelData[pixelOffset + 3];

				let flippedPixelIndex = (imageHeight - row) * imageWidth + column - 1;
				let flippedOffset = flippedPixelIndex * 4;

				flippedPixelData[flippedOffset + 0] = red;
				flippedPixelData[flippedOffset + 1] = green;
				flippedPixelData[flippedOffset + 2] = blue;
				flippedPixelData[flippedOffset + 3] = alpha;
			}
		}

		this.pixelData = new Uint8ClampedArray(flippedPixelData);
	}
	// DEPRECATED: This can't currently be removed, but it really should be refactored at some point
	setTransparencyColor(transparencyColor, sourcePixelFormat = Enum.PIXEL_FORMAT_RGBA) {
		C_Profiling.startTimer("Replacing transparent diffuse texture pixels");

		const pixelData = this.pixelData;
		if (sourcePixelFormat === Enum.PIXEL_FORMAT_ABGR) {
			for (let pixelIndex = 0; pixelIndex < this.pixelData.length; pixelIndex += 1) {
				let pixelOffset = pixelIndex * 4;

				let red = pixelData[pixelOffset + 3];
				let green = pixelData[pixelOffset + 2];
				let blue = pixelData[pixelOffset + 1];

				if (transparencyColor.red === red && transparencyColor.green === green && transparencyColor.blue === blue) {
					pixelData[pixelOffset + 0] = 0; // alpha
				}
			}
		}

		if (sourcePixelFormat === Enum.PIXEL_FORMAT_RGBA) {
			for (let pixelIndex = 0; pixelIndex < this.pixelData.length; pixelIndex += 1) {
				let pixelOffset = pixelIndex * 4;

				let red = pixelData[pixelOffset + 0];
				let green = pixelData[pixelOffset + 1];
				let blue = pixelData[pixelOffset + 2];

				if (transparencyColor.red === red && transparencyColor.green === green && transparencyColor.blue === blue) {
					pixelData[pixelOffset + 3] = 0;
				}
			}
		}

		C_Profiling.endTimer("Replacing transparent diffuse texture pixels");

		this.transparencyColor = transparencyColor;
	}
	toRGBA(sourcePixelFormat = Enum.PIXEL_FORMAT_ABGR) {
		const pixelData = this.pixelData;
		const pixelBuffer = new Uint8ClampedArray(pixelData.length);

		if (sourcePixelFormat === Enum.PIXEL_FORMAT_ABGR) {
			for (let pixelID = 0; pixelID < pixelData.length / 4; pixelID++) {
				const alpha = pixelData[pixelID * 4 + 0];
				const blue = pixelData[pixelID * 4 + 1];
				const green = pixelData[pixelID * 4 + 2];
				const red = pixelData[pixelID * 4 + 3];

				// Swap them to generate RGBA
				pixelBuffer[pixelID * 4 + 0] = red;
				pixelBuffer[pixelID * 4 + 1] = green;
				pixelBuffer[pixelID * 4 + 2] = blue;
				pixelBuffer[pixelID * 4 + 3] = alpha;
			}
		}
		this.pixelFormat = Enum.PIXEL_FORMAT_RGBA;
		this.pixelData = pixelBuffer;
	}
	getPixelFormat() {
		return this.pixelFormat;
	}
	getBufferSize() {
		return this.pixelData.length;
	}
	computeChecksum() {
		return CRC32.fromArrayBuffer(this.pixelData);
	}
	getWidth() {
		return this.width;
	}
	getHeight() {
		return this.height;
	}
	hasAlpha() {
		return this.transparencyColor instanceof Color;
	}
	getTransparencyColor() {
		return this.transparencyColor;
	}
	toArrayBuffer() {
		return new Uint8ClampedArray(this.pixelData);
	}
	toPNG() {
		return UPNG.encode([this.pixelData.buffer], this.width, this.height, 0);
	}
	toJPEG(compressionPercentage = 0) {
		const jpegImageData = JPEGJS.encode(
			{ data: this.pixelData, width: this.width, height: this.height },
			compressionPercentage
		);
		const jpegBytes = new Uint8ClampedArray(jpegImageData.data);
		return jpegBytes.buffer;
	}
}
