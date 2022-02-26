class BmpDecoder extends Decoder {
	fileTypes = { bmp: true };
	decode(resource) {
		const bmp = new BMP();
		bmp.load(resource.rawGet());

		resource.rawSet(bmp.toBitmap());
		return resource;
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
}
