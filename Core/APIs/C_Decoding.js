var format = require("util").format;

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
			NOTICE(
				format(
					"Failed to register decoder for file type %s (already registered)",
					fileType
				)
			);
			return;
		}

		this.registeredDecoders[fileType] = decoder;
		DEBUG(
			format(
				"Registered new decoder for file type *.%s",
				fileType.toUpperCase()
			)
		);
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

		DEBUG(
			format(
				"Resource %s is now in state %s",
				decodedResource.resourceID,
				decodedResource.state
			)
		);
		return decodedResource;
	},
};
