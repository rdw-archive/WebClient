class BuiltinJsonDecoder {
	fileTypes = { json: true };
	constructor(decodingFunction) {
		this.decode = decodingFunction || this.decode; // NO-OP as a safe default
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
	decode(resource) {
		// TODO Add test
		resource.data = JSON.parse(new TextDecoder().decode(resource.data));
		return resource;
	}
}
