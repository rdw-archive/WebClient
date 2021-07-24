const C_Bitmap = {};

C_Bitmap.export = function (
	fileName,
	bitmap,
	pixelFormat = PIXEL_FORMAT_ABGR,
	exportDir = WEBCLIENT_EXPORTS_DIR
) {
	DEBUG(format("Exporting BMP to file " + fileName));

	const data = bitmap.pixelData;
	const width = bitmap.width;
	const height = bitmap.height;

	// The BITMAP encoder expects ABGR and won't use anything else... so we will convert them
	// Note: It's slow doing this without TypedArrays, but this is only used for debugging anyway
	if (pixelFormat === PIXEL_FORMAT_ARGB) {
		for (let pixelID = 0; pixelID < bitmap.pixelData.length / 4; pixelID++) {
			const alpha = bitmap.pixelData[pixelID * 4 + 0];
			const red = bitmap.pixelData[pixelID * 4 + 1];
			const green = bitmap.pixelData[pixelID * 4 + 2];
			const blue = bitmap.pixelData[pixelID * 4 + 3];

			// Swap them to generate ABGR
			bitmap.pixelData[pixelID * 4 + 0] = alpha;
			bitmap.pixelData[pixelID * 4 + 1] = blue;
			bitmap.pixelData[pixelID * 4 + 2] = green;
			bitmap.pixelData[pixelID * 4 + 3] = red;
		}
	}

	const bmpData = {
		data,
		width,
		height,
	};
	const rawData = BITMAP.encode(bmpData);
	C_FileSystem.writeFileBinary(exportDir + "/" + fileName, rawData.data);
};

C_Bitmap.import = function (fileName) {
	const fileContents = C_FileSystem.readFileBinary(fileName);
	return Bitmap_createFromFileContents(fileContents); // This needs refactoring
};
