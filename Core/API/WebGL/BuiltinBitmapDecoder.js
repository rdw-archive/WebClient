// This doesn't do any actual decoding; it merely serves to utilize the Resource cache for audio playback
// The audio engine supports no caching mechanism of its own, so we wrap any calls to disk and serve Resources instead
class BuiltinBitmapDecoder extends Decoder {
	fileTypes = { bmp: true };
	decode(resource) {
		const bitmap = Bitmap.createFromFileContents(resource.rawGet()); // This needs refactoring
		// const bmpData = resource.rawGet()
		// const bitmap = BITMAP.decode(bmpData);
		resource.rawSet(bitmap);
		return resource;
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
}
