class JpegDecoder extends Decoder {
	fileTypes = { jpg: true, jpeg: true };
	decode(resource) {
		const conversionOptions = { useTArray: true, formatAsRGBA: true };
		const jpgData = JPEGJS.decode(resource.rawGet(), conversionOptions);
		const bitmap = new Bitmap(jpgData.data, jpgData.width, jpgData.height);

		resource.rawSet(bitmap);
		return resource;
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
}
