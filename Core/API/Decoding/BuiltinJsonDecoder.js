class BuiltinJsonDecoder {
	fileTypes = { json: true };
	constructor(decodingFunction) {
		this.decode = decodingFunction || this.decode; // NO-OP as a safe default
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
	decode(resource) {
		const textDecoder = new TextDecoder();
		resource.data = JSON.parse(textDecoder.decode(resource.data));
		return resource;
	}
}
