// Danger: Here be dragons (In serious need of refactoring; it's essentially prototype-quality code)

const NUM_BITS_PER_BYTE = 8; // Err, really? What was I thinking?

class Bitmap {
	constructor(pixelData = [], width = 0, height = 0) {
		this.pixelData = pixelData;
		this.width = width;
		this.height = height;
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

		this.pixelData = flippedPixelData;
	}
	finalizePixelData() {
		this.pixelData = Uint8ClampedArray.from(this.pixelData); // TODO: Is this actually needed?
		// Keeping this around after the atlas image is created (below) wastes some space, but allows accessing the individual sprites more easily. I guess it's useful for debugging only?)
		// TODO Remove after atlas is created?
	}
	// TODO: What about the frame ID? Do we need it still?
	// frameID: frameIndex, // NOT redundant; we need a way to identify frames in the bitmap later (the frame index is refered in the sprite's ACT data, but the bin packer sorts them and reassigns the index while creating the atlas...)
	addPixel(red, green, blue, alpha = 1) {
		this.pixelData.push(red);
		this.pixelData.push(green);
		this.pixelData.push(blue);
		this.pixelData.push(alpha);
	}
}


		}


			}
		}

