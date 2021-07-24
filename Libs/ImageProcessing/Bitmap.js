// Danger: Here be dragons (In serious need of refactoring; it's essentially prototype-quality code)

const NUM_BITS_PER_BYTE = 8; // Err, really? What was I thinking?

class Bitmap {
	constructor(pixelData = [], width = 0, height = 0) {
		this.pixelData = pixelData;
		this.width = width;
		this.height = height;
	}
	flipHorizontally(
		pixelData = this.pixelData,
		imageWidth = this.width,
		imageHeight = this.height
	) {
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

// TODO integrate with Bitmap class
function Bitmap_createFromFileContents(buffer) {
	let isTopdownBitmap = false;

	let reader = new BinaryReader(buffer);

	// Header
	let signature = reader.getString(2);
	if (signature !== "BM")
		throw new Error(
			"Invalid signature " + signature + "detected ('BM' expected)"
		);

	let fileSize = reader.getUint32();
	let reserved = reader.getUint32(); // todo when writing, set to custom header?
	let dataOffset = reader.getUint32();
	// InfoHeader
	let infoHeaderSize = reader.getUint32(); // always 40?
	if (infoHeaderSize !== 40)
		throw new Error(
			"infoHeaderSize is not 40 (other versions aren't currently supported)"
		);
	let width = reader.getInt32();
	let height = reader.getInt32();
	if (width % 4 !== 0)
		throw new Error(
			"Bitmap width is not divisible by 4 (padding is not currently supported)"
		);
	if (width != 256) console.log("moep");
	if (height != 256) console.log("moip");
	if (height < 0) {
		isTopdownBitmap = true;
		height = -height;
	}

	let numPlanes = reader.getUint16(); // color planes, must be 1 (in version 40, anyway?)
	if (numPlanes !== 1)
		throw new Error(
			"Number of planes is " +
				bitsPerPixel +
				" (must always be 1 as per the specification)"
		);
	let bitsPerPixel = reader.getUint16();
	// if (bitsPerPixel !== 8)
	// throw new Error('Color depths is ' + bitsPerPixel + ' (only 256 color bitmaps are currently supported');
	let compression = reader.getUint32();
	let compressedImageSizeInBytes = reader.getUint32();
	let pixelsPerMeterX = reader.getUint32(); // horizontal resolution, SIGNED?
	let pixelsPerMeterY = reader.getUint32(); // vertical resolution, SIGNED?
	let numColorsUsed = reader.getUint32(); // 255 or 256?
	const MAX_NUM_COLORS = Math.pow(2, bitsPerPixel);
	if (numColorsUsed === 0) numColorsUsed = MAX_NUM_COLORS; // default to "all colors"? Haven't found a good explanation
	numColorsUsed = MAX_NUM_COLORS; // Assume 256 colors; if we read the wrong colors later it won't matter since if the color isn't referenced in the pixel data it won't be displayed anyway and we reset the pointer to wherever dataOffset claims we should go either way. BUT if it IS actually used and the numColorsUsed field is wrong because BMP is hard, it will look right... win/win?

	// If the palette doesn't have 256 colors, the rest is filled up with black apparently?
	// At least that holds true for the bitmaps I tested, I saw existing palette entries being ignored in Windows/graphics program
	// and replaced with black, but inspecting the file in a hex editor shows the "missing" palette entry is actually there
	// (and not black), i.e. the numColors = 255 is set and according to the spec it SHOULD mean "there are only 255 entries in the color palette instead of 256", when really it should be 0x00 = 256 colors? Not sure if this is a mistake in whatever tool they used to create the bitmaps, or my own understanding is flawed... for now, I'll just ignore the numColors field and always assume 256 entries exist, which hasn't crashed for any BMPs I tested but theoretically might :/
	// may crash if reading a BMP that actualy does things differently...
	let numImportantColors = reader.getUint32(); // 0 = all (what is an "important" color?)

	let bytesPerPixel = bitsPerPixel / NUM_BITS_PER_BYTE;
	let requiredPaddingBytes = (width * bytesPerPixel) % 4; // (width * channels) % 4 ?
	if (requiredPaddingBytes !== 0)
		throw new Error("Padding is not currently supported");

	// ColorTable
	let colorTable = [];
	if (bitsPerPixel <= 8) {
		// reader.offset = reader.offset + 4
		for (tableIndex = 0; tableIndex < numColorsUsed; tableIndex++) {
			// } else {
			let blue = reader.getUint8();
			let green = reader.getUint8();
			let red = reader.getUint8();
			// Probably: numColors is wrong and we're already into the pixel data... but it won't matter since the wrong colors we're reading simply won't be displayed as they aren't referenced... yay for keeping to the spec, I guess
			let reserved = reader.getUint8();
			// if (reserved !== 0x00)
			// throw new Error("Reserved palette alpha is " + reserved + " (bitmap transparency is not currently supported");
			let color = {
				red: red,
				green: green,
				blue: blue,
				alpha: 255, // 0 = unused (set to 255 to get the same effect with actual RGBA)
			};
			colorTable.push(color);
			// }
		}
	}
	// let dataOffset = reader.getUint32();
	// if (numColorsUsed < MAX_NUM_COLORS) {
	// fil the rest of the palette with with black?
	const COLOR_RGB_BLACK = {
		red: 0,
		green: 0,
		blue: 0,
		alpha: 255,
	};
	// colorTable.push(color);
	// }

	// Pixel data
	let numPixels = width * height;
	if (compression !== 0) {
		numPixels = compressedImageSizeInBytes;
		throw new Error("Bitmap compression is not currenty supported");
	}

	if (dataOffset !== reader.offset) {
		// Fast-forwarding to the pixel data to skip the optional Gap1 portion of the file header
		console.log(
			"Data offset " +
				dataOffset +
				" doesn't match reader offset " +
				reader.offset
		);
		reader.offset = dataOffset; // there are two zero bytes at the end??
		// reader.offset = dataOffset.offset + 2; // there are two zero bytes at the end??
	}

	const COLOR_RGB_RED = {
		red: 255,
		green: 0,
		blue: 0,
		alpha: 255,
	};

	let pixelData = new Uint8ClampedArray(width * height * 4);
	let paletteIndices = []; // mostly useful for debugging purposes, or to swap out the color palette (later on)
	for (pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
		if (bitsPerPixel === 8) {
			// 256-color bitmap: Each byte represents a single pixel, described as palette index
			let paletteIndex = reader.getUint8();
			paletteIndices.push(paletteIndex);

			if (paletteIndex > colorTable.length) {
				throw new Error(
					"Palette index is " +
						paletteIndex +
						"but there are only" +
						colorTable.length +
						" palette entries"
				);
				// if numColors is <255 ???
			}
			let color = colorTable[paletteIndex];

			let column = pixelIndex % width;
			let row = Math.floor(pixelIndex / width);
			// f(x, y) = (x, height-y) is the linear transformation of the bitmap's coordinate space (AKA mirror along the X axis)
			// That is, the origin (0,0) simply moves to (0, height) and the pixels are rendered right->down instead of right->up
			if (!isTopdownBitmap) row = height - (row + 1); // We write top->down, so invert unless it's already "correct"
			let pixelOffset = (column + row * width) * 4; // RGBA = 4 bytes per pixel
			// let pixelOffset = pixelIndex * 4 // RGBA = 4 bytes per pixel
			// if (color === undefined)
			// console.log("Y U NO WORK?")
			// break;
			pixelData[pixelOffset + 0] = color.red;
			pixelData[pixelOffset + 1] = color.green;
			pixelData[pixelOffset + 2] = color.blue;
			pixelData[pixelOffset + 3] = color.alpha;
		}
	}

	let bmpData = {
		signature: signature,
		fileSize: fileSize,
		reserved: reserved,
		dataOffset: dataOffset,
		infoHeaderSize: infoHeaderSize,
		width: width,
		height: height,
		numPlanes: numPlanes,
		bitsPerPixel: bitsPerPixel,
		compression: compression,
		compressedImageSizeInBytes: compressedImageSizeInBytes,
		pixelsPerMeterX: pixelsPerMeterX,
		pixelsPerMeterY: pixelsPerMeterY,
		numColorsUsed: numColorsUsed,
		numImportantColors: numImportantColors,
		colorTable: colorTable,
		paletteIndices: paletteIndices,
		pixelData: pixelData,
	};

	// console.log("Finished reading pixel data at offset " + reader.offset + " (fileSize is " + fileSize + ")")
	// console.log(bmpData);

	// for (x = 0; x < width; x++) {
	// 	for (y = 0; y < height; y++) {
	// 		pixelData.push(255, 0, 0, 255); // RGBA
	// 	}
	// }

	return bmpData;
}

// I hate JavaScript
window.Bitmap = Bitmap;
