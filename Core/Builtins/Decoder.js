class Decoder {
	fileTypes = {};
	constructor(decodingFunction) {
		this.decode = decodingFunction || this.decode; // NO-OP as a safe default
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
	decode(resource) {
		return resource;
	}
}
