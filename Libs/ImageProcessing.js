
const ADD_OUTER_PADDING = false;

// Enums
const RGBA_COLOR_LENGTH = 4; // R, G, B, A... duh
const RGB_COLOR_MAGENTA = {
	red: 255,
	green: 0,
	blue: 255,
	alpha: 255,
};
const RGB_COLOR_PURPLE = {
	red: 255,
	green: 0,
	blue: 255,
	alpha: 255,
};
const RGB_COLOR_BLACK = {
	red: 0,
	green: 0,
	blue: 0,
	alpha: 255,
};
const RGB_COLOR_GREEN = {
	red: 0,
	green: 255,
	blue: 0,
	alpha: 255,
};

const DEFAULT_SPRITESHEET_WIDTH = 4096; // TODO if this is small, multiple bins are created... this is not something we want...
const DEFAULT_SPRITESHEET_HEIGHT = 4096;
// Larger textures than 2048px might cause problems for mobile etc., so let's try to make due without them for now

// Blitter settings
let ENABLE_BORDER_FILL = true;
const BORDER_SIZE_PIXELS = 128; // must be the same as the settings passed to the bin packer (padding/border)
const BACKGROUND_FILL_COLOR = RGB_COLOR_GREEN
const BORDER_FILL_COLOR = RGB_COLOR_MAGENTA // for easier debugging

// Combines smaller bitmaps into a texture atlas
function Bitmap_CreateTextureAtlas(frames,  addOuterPadding = ADD_OUTER_PADDING, clearColor, atlasWidth = DEFAULT_SPRITESHEET_WIDTH, atlasHeight = DEFAULT_SPRITESHEET_HEIGHT) {

	if (!ENABLE_BORDER_FILL) BORDER_SIZE_PIXELS = 0; // Overriding the regular setting is easiest here
	let backgroundFillColor = clearColor || BACKGROUND_FILL_COLOR


	let spritesheetPixels = new Uint8ClampedArray(atlasWidth * atlasHeight * RGBA_COLOR_LENGTH);
	// Make sure the background is always clear/transparent (as it will be initialised with zeroes = white otherwise)
	for (pixelIndex = 0; pixelIndex < spritesheetPixels.length; pixelIndex = pixelIndex + RGBA_COLOR_LENGTH) {
		spritesheetPixels[pixelIndex + 0] = backgroundFillColor.red
		spritesheetPixels[pixelIndex + 1] = backgroundFillColor.green
		spritesheetPixels[pixelIndex + 2] = backgroundFillColor.blue
		spritesheetPixels[pixelIndex + 3] = backgroundFillColor.alpha
		spritesheetPixels[pixelIndex + 3] = backgroundFillColor.alpha
	}

	let packer = new BinPacker(atlasWidth, atlasHeight);
	packer.setFrames(frames);

	// TODO We must preserve the original frame indices, as they're referenced in ACT files?? Just add a field to the Frame struct then?

	// Draw contents of the bin at the given coords in the spritesheet (generate pixel/bitmap data)
	function Bitmap_DrawSprite(frameWidth, frameHeight, pixelData, offsetX, offsetY) {

		// 2D -> 2D (translate frame to spritesheet coordinates)
		function transformCoordinateSpaceX(x) {
			return x + offsetX
		}

		// 2D -> 2D (translate frame to spritesheet coordinates)
		function transformCoordinateSpaceY(y) {
			return y + offsetY
		}

		//  2D -> 1D (to place in the bitmap's pixelData array later on)
		function lineariseCoordinates(x, y, pixelsPerRow) {
			return x + (y - 1) * pixelsPerRow
		}

		// 1D -> 1D (to account for the fact that each RGBA pixel takes up 4 bytes)
		function transformToRgbaSpace(pixelIndex) {
			return pixelIndex * RGBA_COLOR_LENGTH
		}

		function drawRectangle(startX, startY, width, height, color) {

			for (let borderPixelY = startY + 1; borderPixelY < startY + height + 1; borderPixelY++) {
				for (let borderPixelX = startX; borderPixelX < startX + width; borderPixelX++) {
					let pixelIndex = lineariseCoordinates(borderPixelX, borderPixelY, atlasWidth);
					pixelIndex = transformToRgbaSpace(pixelIndex);

					spritesheetPixels[pixelIndex + 0] = color.red;
					spritesheetPixels[pixelIndex + 1] = color.green;
					spritesheetPixels[pixelIndex + 2] = color.blue;
					spritesheetPixels[pixelIndex + 3] = color.alpha;
				}
			}
		}

		// Returns a slice of the image data
		function getImageSlice(pixelData, offsetX, offsetY, width, height) {

			let slice = [];

			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {

					let sourceX = offsetX + x;
					let sourceY = offsetY + y;
					let sourceIndex = (sourceX + sourceY * frameWidth) * RGBA_COLOR_LENGTH;

					let destX = x;
					let destY = y;
					let destIndex = (destX + destY * width) * RGBA_COLOR_LENGTH;

					let sourceColorRed = pixelData[sourceIndex + 0];
					let sourceColorGreen = pixelData[sourceIndex + 1];
					let sourceColorBlue = pixelData[sourceIndex + 2];
					let sourceColorAlpha = pixelData[sourceIndex + 3];

					slice[destIndex + 0] = sourceColorRed; // R
					slice[destIndex + 1] = sourceColorGreen; // G
					slice[destIndex + 2] = sourceColorBlue; // B
					slice[destIndex + 3] = sourceColorAlpha;  // A

				}
			}

			return slice;

		}

		// Overwrites a slice of the image data with another (inplace, since pixel data is passed by reference for arrays)
		function putImageSlice(pixelData, slice, offsetX, offsetY, width, height) {

			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {

					let sourceX = x;
					let sourceY = y;
					let sourceIndex = (sourceX + sourceY * width) * RGBA_COLOR_LENGTH;

					let destX = offsetX + x;
					let destY = offsetY + y;
					let destIndex = (destX + destY * atlasWidth) * RGBA_COLOR_LENGTH;

					let sourcePixelRed = slice[sourceIndex + 0];
					let sourcePixelGreen = slice[sourceIndex + 1];
					let sourcePixelBlue = slice[sourceIndex + 2];
					// let sourcePixelAlpha = slice[sourceIndex + 3];

					let destinationPixelRed = pixelData[destIndex + 0];
					let destinationPixelGreen = pixelData[destIndex + 1];
					let destinationPixelBlue = pixelData[destIndex + 2];
					// let destinationPixelAlpha = pixelData[destIndex + 3];

					pixelData[destIndex + 0] = destinationPixelRed; // R
					pixelData[destIndex + 1] = destinationPixelGreen; // G
					pixelData[destIndex + 2] = destinationPixelBlue; // B
					// pixelData[destinationPixelIndex + 3] = sourcePixelAlpha; // A
					pixelData[destIndex + 3] = 255; // Alpha not supported

					pixelData[destIndex + 0] = sourcePixelRed; // R
					pixelData[destIndex + 1] = sourcePixelGreen; // G
					pixelData[destIndex + 2] = sourcePixelBlue; // B
					// pixelData[destinationPixelIndex + 3] = sourcePixelAlpha; // A
					pixelData[destIndex + 3] = 255; // Alpha not supported

				}
			}

		}

		// Draw border first by drawing a larger square (it's a bit wasteful, but eh.. can always optimize it later
		// Note: Enabling this will overwrite the previously drawn padding, use for debugging/visualisation only (uncomment)
		// drawRectangle(offsetX - BORDER_SIZE_PIXELS, offsetY - BORDER_SIZE_PIXELS, frameWidth + 2 * BORDER_SIZE_PIXELS, frameHeight + 2 * BORDER_SIZE_PIXELS, BORDER_FILL_COLOR)

		// Draw frame data for the given frame
		for (let sourcePixelY = 1; sourcePixelY <= frameHeight; sourcePixelY++) { // Why start at 1 instead of 0, or vice versa? (due to the height calculation?? it takes y - 1 so it expects the first one to be 1 and not zero)
			for (let sourcePixelX = 0; sourcePixelX < frameWidth; sourcePixelX++) { // Changing this seems to cause glitches

				// Start drawing at coords x, y. Draw frameData.height lines of length frameData.width using the pixelData
				// Offsets are kept for the spritesheet (where to PLACE the pixels) and for the source (WHICH pixels to place here)
				let destinationPixelX = transformCoordinateSpaceX(sourcePixelX);
				let destinationPixelY = transformCoordinateSpaceY(sourcePixelY);

				// Since bitmap data is given as 4 bytes (RGBA), we transfer 4 bytes at each offset
				let destinationPixelIndex = lineariseCoordinates(destinationPixelX, destinationPixelY, atlasWidth);
				let sourcePixelIndex = lineariseCoordinates(sourcePixelX, sourcePixelY, frameWidth);

				destinationPixelIndex = transformToRgbaSpace(destinationPixelIndex);
				sourcePixelIndex = transformToRgbaSpace(sourcePixelIndex);

				let sourcePixelRed = pixelData[sourcePixelIndex + 0];
				let sourcePixelGreen = pixelData[sourcePixelIndex + 1];
				let sourcePixelBlue = pixelData[sourcePixelIndex + 2];
				let sourcePixelAlpha = pixelData[sourcePixelIndex + 3];

				spritesheetPixels[destinationPixelIndex + 0] = sourcePixelRed;
				spritesheetPixels[destinationPixelIndex + 1] = sourcePixelGreen;
				spritesheetPixels[destinationPixelIndex + 2] = sourcePixelBlue;
				spritesheetPixels[destinationPixelIndex + 3] = sourcePixelAlpha;

			}
		}

		if(!addOuterPadding) return;

		const OUTER_PADDING_WIDTH = BORDER_SIZE_PIXELS / 2;
		let NUM_SAMPLED_BORDER_PIXELS = 1; // anything more might be subject to distortion?
		let numRepetitions = OUTER_PADDING_WIDTH;

		// Finally, pad the borders with the content of the nearby texture data (to minimize bleeding when downscaled for mipmaps)
		// We only use half the border to avoid overlapping, i.e., 2px border will be filled with 1 px anti-bleeding pixels
		let topLeftPadding = getImageSlice(pixelData, 0, 0, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);
		let topRightPadding = getImageSlice(pixelData, frameWidth - BORDER_SIZE_PIXELS / 2, 0, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);
		let bottomRightPadding = getImageSlice(pixelData, frameWidth - BORDER_SIZE_PIXELS / 2, frameHeight - BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);
		let bottomLeftPadding = getImageSlice(pixelData, 0, frameHeight - BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);

		let leftPadding = getImageSlice(pixelData, 0, 0, NUM_SAMPLED_BORDER_PIXELS, frameHeight);
		let rightPadding = getImageSlice(pixelData, frameWidth - BORDER_SIZE_PIXELS / 2, 0, NUM_SAMPLED_BORDER_PIXELS, frameHeight);
		let topPadding = getImageSlice(pixelData, 0, 0, frameWidth, NUM_SAMPLED_BORDER_PIXELS);
		let bottomPadding = getImageSlice(pixelData, 0, frameHeight - BORDER_SIZE_PIXELS / 2, frameWidth, NUM_SAMPLED_BORDER_PIXELS);



		// In order to remove artifacts caused by mipmapping/downsampling, we can repeat the outermost pixel (or more, if you want to risk it. I don't.) a few times. It's not perfect, but better than getting a guaranteed artifact from texture bleeding so it should work alright if the camera isn't too far away and mipmaps are too low a resolution (limit them?)
		for (let i = 0; i < numRepetitions; i++) {
			// We basically just take a 1px wide rectangle from the frame's outskirts and repeat it a couple of times to the left, right etc (left border = repeat left etc) causing a "smeared" area of identical colors outside the UV range
			// This causes the sampler to blend in four identical pixels* instead of two from the texture and two from whatever was next to it
			// (* hopefully... mipmapping can break it still, as well as it generally being noticeable if very close)
			// For more info see: http://kylehalladay.com/blog/tutorial/2016/11/04/Texture-Atlassing-With-Mips.html
			// This is the same idea but a bit less fancy, and seems to work well enough to not bother with the rest right now
			putImageSlice(spritesheetPixels, leftPadding, offsetX - (OUTER_PADDING_WIDTH - i), offsetY, NUM_SAMPLED_BORDER_PIXELS, frameHeight);
			putImageSlice(spritesheetPixels, rightPadding, offsetX + frameWidth + i, offsetY, NUM_SAMPLED_BORDER_PIXELS, frameHeight);
			putImageSlice(spritesheetPixels, topPadding, offsetX, offsetY - (OUTER_PADDING_WIDTH - i), frameWidth, NUM_SAMPLED_BORDER_PIXELS);
			putImageSlice(spritesheetPixels, bottomPadding, offsetX, offsetY + frameHeight + i, frameWidth, NUM_SAMPLED_BORDER_PIXELS);

		}

		// We could repeat the corners, too, but it would have to be diagonally. Right now I CBA, there are always a few artifacts left but only if zooming in a lot and after post-processing and lighting are added it might not even be noticeable?
		putImageSlice(spritesheetPixels, topLeftPadding, offsetX - BORDER_SIZE_PIXELS / 2, offsetY - BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);
		putImageSlice(spritesheetPixels, topRightPadding, offsetX + frameWidth, offsetY - BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);
		putImageSlice(spritesheetPixels, bottomLeftPadding, offsetX - BORDER_SIZE_PIXELS / 2, offsetY + frameHeight, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);
		putImageSlice(spritesheetPixels, bottomRightPadding, offsetX + frameWidth, offsetY + frameHeight, BORDER_SIZE_PIXELS / 2, BORDER_SIZE_PIXELS / 2);

		// todo flip corners OR just use the bottom right pixel? OR do a diagonal scaling thing? take avg of the edges and fill?


	}

	// Bin packing stuff
	let numSpritesheets = packer.getNumBins();
	if (numSpritesheets > 1) {
		throw new Error("Failed to combine sprites into a single " + atlasWidth + "x" + atlasHeight + " texture atlas (limit is too small?)");
		// We don't want multiple textures for a single spritesheet, nor to deal with the added complexity of managing them
		// It shouldn't be necessary if the spritesheet size is large enough to fit all sprites, so this is most likely accidental
	}
	let bin = packer.getBin(0); // always 0
	for (frameIndex = 0; frameIndex < bin.rects.length; frameIndex++) {
		let rectangles = packer.getRectangles();
		let frame = rectangles[frameIndex];
		Bitmap_DrawSprite(frame.width, frame.height, frame.pixelData, frame.x, frame.y);
	}

	let spritesheetImage = {
		pixelData: spritesheetPixels,
		width: atlasWidth,
		height: atlasHeight,
	}

	let spritesheetInfo = {
		clearColor: backgroundFillColor,
		frames: bin.rects, // TODO: map original frame index to these?
	}

	let spritesheet = {
		spritesheetImage: spritesheetImage,
		spritesheetInfo: spritesheetInfo,
	}

	return spritesheet;
}