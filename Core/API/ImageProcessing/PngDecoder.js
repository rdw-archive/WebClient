class PngDecoder extends Decoder {
	fileTypes = { png: true };
	decode(resource) {
		const pngImage = UPNG.decode(resource.rawGet());
		const pngFrames = UPNG.toRGBA8(pngImage);

		// I have no idea if this can even happen, but it seems silly and not like something we want to work around
		if (pngFrames.length !== 1) throw new Error("Only PNG images with a single frame are currently supported");
		const pixelBuffer = pngFrames[0];
		const bitmap = new Bitmap(new Uint8ClampedArray(pixelBuffer), pngImage.width, pngImage.height);

		resource.rawSet(bitmap);
		return resource;
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
}
