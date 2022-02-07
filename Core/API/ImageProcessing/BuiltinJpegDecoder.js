class BuiltinJpegDecoder extends Decoder {
	fileTypes = { jpg: true, jpeg: true };
	decode(resource) {
		const jpgData = JPEG.decode(resource.rawGet(), { useTArray: true });
		const bitmap = new Bitmap(jpgData.data, jpgData.width, jpgData.height);

		resource.rawSet(bitmap);
		return resource;
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
}
