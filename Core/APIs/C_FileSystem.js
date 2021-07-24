// This API will only work if nodeIntegration is enabled (potentially insecure!), or an IPC proxy is set up
let C_FileSystem = {
	// Basic I/O can be blocking; it's only used for configuration or TOC (manifest) files
	// Only works for non-binary = text/JSON? Returns a NodeJS buffer, which is useless otherwise
	readFile(filePath) {
		// tbd try/catch needed here?
		// tbd: use createReadStream to minimize memory usage?
		return NODE.FileSystem.readFileSync(filePath);
	},
	readFileBinary(filePath) {
		const buffer = NODE.FileSystem.readFileSync(filePath);
		// This is awkward (like anything JS...), but needed in some cases - see https://nodejs.org/dist/latest-v12.x/docs/api/buffer.html#buffer_buf_byteoffset
		const arrayBuffer = buffer.buffer.slice(
			buffer.byteOffset,
			buffer.byteOffset + buffer.byteLength
		);
		return arrayBuffer;
	},
	writeFileBinary(filePath, buffer) {
		NODE.FileSystem.writeFileSync(filePath, buffer);
	},
	readJSON(filePath) {
		DEBUG(format("Reading JSON from file %s", filePath));
		const fileContents = this.readFile(filePath);
		return JSON.parse(fileContents);
	},
	writeJSON(filePath, object) {
		DEBUG(format("Writing JSON to file %s", filePath));
		NODE.FileSystem.writeFileSync(filePath, JSON.stringify(object));
	},
	getFilesInFolder(folderPath) {
		if (!this.fileExists(folderPath)) return [];

		return NODE.FileSystem.readdirSync(folderPath);
	},
	fileExists(filePath) {
		return NODE.FileSystem.existsSync(filePath);
	},
	makeDirectory(filePath) {
		if (this.fileExists(filePath)) return;

		DEBUG(format("Making directory %s", filePath));
		NODE.FileSystem.mkdirSync(filePath);
	},
	removeDirectory(filePath) {
		if (!this.fileExists(filePath)) return;
		NODE.FileSystem.rmdirSync(filePath);
	},
	computeChecksum(filePath) {
		const buffer = this.readFileBinary(filePath);

		const checksum = CRC32.fromArrayBuffer(buffer);
		DEBUG(
			format(
				"Computed CRC32 for file %s: %d (%x)",
				filePath,
				checksum,
				checksum
			)
		);
		return checksum;
	},
	removeFile(filePath) {
		if (!this.fileExists(filePath)) return;
		DEBUG(format("Attempting to remove file %s", filePath));
		NODE.FileSystem.unlinkSync(filePath);
	},
};
