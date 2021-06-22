/**
 * Provides facilities for decoding Resources.
 * <p>
 * Decoding is the process of parsing data from an incompatible input source, such as custom binary or proprietary formats, and storing in memory a representation that the client understands.
 * </p>
 * @see {@link Resource}
 * @see {@link Decoder}
 * @see [HOWTO: Working with custom file formats]{@link http://google.com}
 * @see [HOWTO: Writing your own decoder]{@link http://google.com}
 * @namespace C_Decoding
 *
 */
const C_Decoding = {
	registeredDecoders: {},
	getDecoderForFile(filePath) {
		const fileType = this.getFileType(filePath);
		return this.registeredDecoders[fileType];
	},
	getFileType(filePath) {
		const standardizedFilePath = filePath.toLowerCase();

		const fileNameWithExtension = standardizedFilePath.split(/[\\/]/).pop();
		const dotPosition = fileNameWithExtension.lastIndexOf(".");

		const isFileNameEmpty = fileNameWithExtension === "";
		const hasExtension = dotPosition >= 1; // -1: no dot; 0: first character is dot
		if (isFileNameEmpty || !hasExtension) return "";

		const extensionWithoutDot = fileNameWithExtension.slice(dotPosition + 1);
		return extensionWithoutDot;
	},
	canDecodeFile(filePath) {
		if (!this.getDecoderForFile(filePath)) return false;
		return true;
	},
	addDecoder(decoder) {
		const fileType = decoder.getSupportedFileType();

		if (this.registeredDecoders[fileType]) {
			NOTICE(format("Failed to register decoder for file type %s (already registered)", fileType));
			return;
		}

		this.registeredDecoders[fileType] = decoder;
		DEBUG(format("Registered new decoder for file type *.%s", fileType.toUpperCase()));
	},
	decodeFile(filePath) {
		const resource = C_Resources.load(filePath);
		if (resource.isReady()) return resource; // already cached = it's been decoded previously (hopefully...)

		C_Profiling.startTimer("Decode " + filePath);

		DEBUG(format("Decoding resource %s", filePath));
		const decoder = this.getDecoderForFile(filePath);
		const decodedResource = this.decodeResource(resource, decoder);

		C_Profiling.endTimer("Decode " + filePath);

		C_Resources.updateCachedResource(filePath, decodedResource);

		return decodedResource;
	},
	decodeResource(resource, decoder) {
		resource.state = RESOURCE_STATE_DECODING;
		const decodedResource = decoder.decode(resource);
		decodedResource.state = RESOURCE_STATE_READY;

		DEBUG(format("Resource %s is now in state %s", decodedResource.resourceID, decodedResource.state));
		return decodedResource;
	},
};
    /**
     * Attempts to deduce the type for a given file (based on its extension). Returns the Decoder registered to it, or undefined if none was found.
     * @param {string} filePath Path to the file that is to be decoded
     * @returns {Decoder|undefined} The Decoder registered for this file type, or undefined if none has been registered
     */
    /**
     * Attempts to deduce the type for a given file (based on its extension) and returns it.
     * <p>
     * Note: This is a simple convenience method. It specifically does NOT analyze the file itself and is thus very lightweight.
     * </p>
     * @param {string} filePath Path to the file that is to be decoded
     * @returns {string} The file extension, excluding the dot.
     */
    /**
     * Returns whether or not a given file can (presumably) be decoded.
     *
     * <p>
     * Note: Files are assumed to be decodable if a Decoder for the given file type is registered, but this isn't verified internally.
     * </p>
     * @param {string} filePath Path to the file that is to be decoded
     * @returns {boolean} <code>true</code> if the file type can be decoded, and <code>false</code> otherwise
     */
    /**
     * TODO
     *
     */
    /**
     * Attempts to decode a given file, loading it from disk first if necessary.
     *
     * @param {string} filePath Path to the file that is to be decoded
     * @return {Resource} The decoded resource that should now be ready to use
     */
    /**
     * Attempts to decode a Resource using a given Decoder.
     * @param {Resource} resource The Resource that is to be decoded
     * @param {Decoder} decoder The Decoder that is to be used for this Resource
     * @return {Resource} The decoded resource that should now be ready to use
     */
