/**
 * Decoding stuff is fun
 * @see {@link Resource, @link C_Decoding}
 */
class Decoder {
	constructor(fileType, decodingFunction) {
		this.fileType = fileType;
		this.decodingFunction = decodingFunction;
	}
	getSupportedFileType() {
		return this.fileType;
	}
	decode(resource) {
		return this.decodingFunction(resource);
	}
}
