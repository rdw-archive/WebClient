class BuiltinJsonDecoder {
	fileTypes = { json: true };
	constructor(decodingFunction) {
		this.decode = decodingFunction || this.decode; // NO-OP as a safe default
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
	decode(resource) {
		resource.data = JSON.parse(JSON.stringify(resource.data));
		return resource;
	}
}
