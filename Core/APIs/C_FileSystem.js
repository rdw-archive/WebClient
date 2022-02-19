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
		const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		return arrayBuffer;
	},
	writeFileBinary(filePath, arrayBuffer) {
		NODE.FileSystem.writeFileSync(filePath, Buffer.from(arrayBuffer));
	},
	readJSON(filePath) {
		DEBUG(format("Reading JSON from file %s", filePath));
		const fileContents = this.readFile(filePath);
		return JSON.parse(fileContents);
	},
	writeJSON(filePath, object, humanReadable = true) {
		DEBUG(format("Writing JSON to file %s", filePath));
		NODE.FileSystem.writeFileSync(filePath, JSON.stringify(object, null, humanReadable ? "\t" : null));
	},
	getFilesInFolder(folderPath) {
		if (!this.fileExists(folderPath)) return [];

		return NODE.FileSystem.readdirSync(folderPath);
	},
	getFileInfo(filePath) {
		return NODE.FileSystem.statSync(filePath);
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
	isDirectory(filePath) {
		const stats = this.getFileInfo(filePath);
		return stats.isDirectory();
	},
	computeChecksum(filePath) {
		const buffer = this.readFileBinary(filePath);

		const checksum = CRC32.fromArrayBuffer(buffer);
		DEBUG(format("Computed CRC32 for file %s: %d (%x)", filePath, checksum, checksum));
		return checksum;
	},
	removeFile(filePath) {
		if (!this.fileExists(filePath)) return;
		DEBUG(format("Attempting to remove file %s", filePath));
		NODE.FileSystem.unlinkSync(filePath);
	},
	// TBD Move to C_Compression API?
	readCompressedFile(filePath, compressionMode) {
		C_Profiling.startTimer("Reading file " + filePath);
		const buffer = this.readFileBinary(filePath);
		C_Profiling.endTimer("Reading file " + filePath);

		// TODO Refactor, tests, different compression modes
		const zlib = require("zlib");
		C_Profiling.startTimer("Decompressing buffer (INFLATE)");
		const uncompressedBuffer = zlib.inflateSync(buffer);
		C_Profiling.endTimer("Decompressing buffer (INFLATE)");

		// TODO Remove
		console.log(uncompressedBuffer);

		return uncompressedBuffer;
	},
	writeCompressedFile(filePath, buffer) {
		C_Profiling.startTimer("Compressing buffer (INFLATE)");
		const zlib = require("zlib");
		const compressedBuffer = zlib.deflateSync(buffer);
		C_Profiling.endTimer("Compressing buffer (INFLATE)");
		this.writeFileBinary(filePath, compressedBuffer);
	},
	// Test: C_FileSystem.writeCompressedJSON("E:\\Test.zip", {"Hello": "World"})
	writeCompressedJSON(filePath, json) {
		C_Profiling.startTimer("Compressing buffer (INFLATE)");
		const zlib = require("zlib");
		console.log(json);
		// const compressedBuffer = zlib.deflateSync(new TextEncoder().encode(JSON.stringify(json)));
		C_Profiling.endTimer("Compressing buffer (INFLATE)");
		this.writeFileBinary(filePath, compressedBuffer);
	},
	readCompressedJSON(filePath, compressionMode) {
		C_Profiling.startTimer("Reading file " + filePath);
		const compressedBuffer = this.readFileBinary(filePath);
		C_Profiling.endTimer("Reading file " + filePath);
		const zlib = require("zlib");

		C_Profiling.startTimer("Decompressing buffer (INFLATE)");
		const uncompressedBuffer = zlib.inflateSync(compressedBuffer);
		C_Profiling.endTimer("Decompressing buffer (INFLATE)");

		const json = new TextDecoder().decode(uncompressedBuffer);

		return json;
	},
	walk(directoryPath) {
		const entries = WALK.walkSync(directoryPath, { stats: true });
		entries.forEach((entry, key) => {
			const filePath = entry.path;
			const stats = entry.stats;
			if (entry.stats.isDirectory()) delete entries[key];
		});
		return entries;
	},
};
