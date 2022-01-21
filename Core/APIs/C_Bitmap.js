var format = require("util").format;

const C_Bitmap = {};

C_Bitmap.export = function (fileName, bitmap, pixelFormat = Enum.PIXEL_FORMAT_ABGR, exportDir = WEBCLIENT_EXPORTS_DIR) {
	DEBUG(format("Exporting BMP to file " + fileName));

	const pixelData = bitmap.pixelData;
	const width = bitmap.width;
	const height = bitmap.height;

	// The BITMAP encoder expects ABGR and won't use anything else... so we will convert them
	// Note: It's slow doing this without TypedArrays, but this is only used for debugging anyway
	const pixelBuffer = new Uint8ClampedArray(pixelData.length);
	if (pixelFormat === Enum.PIXEL_FORMAT_ARGB) {
		for (let pixelID = 0; pixelID < pixelData.length / 4; pixelID++) {
			const alpha = pixelData[pixelID * 4 + 0];
			const red = pixelData[pixelID * 4 + 1];
			const green = pixelData[pixelID * 4 + 2];
			const blue = pixelData[pixelID * 4 + 3];

			// Swap them to generate ABGR
			pixelBuffer[pixelID * 4 + 0] = alpha;
			pixelBuffer[pixelID * 4 + 1] = blue;
			pixelBuffer[pixelID * 4 + 2] = green;
			pixelBuffer[pixelID * 4 + 3] = red;
		}
	}

	if (pixelFormat === Enum.PIXEL_FORMAT_RGBA) {
		for (let pixelIndex = 0; pixelIndex < pixelData.length / 4; pixelIndex += 1) {
			const red = pixelData[pixelIndex * 4 + 0];
			const green = pixelData[pixelIndex * 4 + 1];
			const blue = pixelData[pixelIndex * 4 + 2];
			const alpha = pixelData[pixelIndex * 4 + 3];

			pixelBuffer[pixelIndex * 4 + 0] = alpha;
			pixelBuffer[pixelIndex * 4 + 1] = blue;
			pixelBuffer[pixelIndex * 4 + 2] = green;
			pixelBuffer[pixelIndex * 4 + 3] = red;
		}
	}

	const data = pixelBuffer; // WTF, BITMAP issue?
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
	return Bitmap.createFromFileContents(fileContents); // This needs refactoring
};

const C_ImageProcessing = {
	loadBMP(filePath, transparencyColor) {
		// TODO use resource cache to avoid having to do this multiple times
		DEBUG(format("Attempting to load BMP image from URL %s", filePath));

		const bmpData = BITMAP.decode(NODE.FileSystem.readFileSync(filePath));
		const diffuseTextureBitmap = new Bitmap(bmpData.data, bmpData.width, bmpData.height);
		diffuseTextureBitmap.toRGBA(Enum.PIXEL_FORMAT_ABGR); // bmp-js seems to use ABGR internally, but we assume RGBA

		if (!diffuseTextureBitmap.transparencyColor && transparencyColor !== undefined) {
			// Bit of a hack, since the Bitmap class doesn't handle this yet?
			// It's not a problem to do this multiple times, since it only takes ~1ms, but still we can skip it...
			C_Profiling.startTimer("Replacing transparent diffuse texture pixels");
			// This may not work if they use similar but not identical colors (are there textures that do this?)
			// const transparencyColor = new Color(255, 0, 255);
			diffuseTextureBitmap.setTransparencyColor(transparencyColor, Enum.PIXEL_FORMAT_RGBA);
			// setTransparencyThreshold(minRed, minGreen, maxBlue?)
			C_Profiling.endTimer("Replacing transparent diffuse texture pixels");
			diffuseTextureBitmap.transparencyColor = transparencyColor;
		}
		return diffuseTextureBitmap;
	},
	// 	loadBMP(filePath) {
	// 	const bmpResource = C_Decoding.decodeFile(filePath);
	// 	const bmpData = bmpResource.rawGet();
	// 	const bitmap = new Bitmap(bmpData.pixelData, bmpData.width, bmpData.height);
	// 	return bitmap;
	// },
	//JPEG.decode(C_FileSystem.readFileBinary(path.join(WEBCLIENT_ASSETS_DIR, "texture", "¿öÅÍ", "water010.jpg")), {useTArray: true}).data
	loadJPEG(filePath) {
		// TODO use resource cache to avoid having to do this multiple times
		DEBUG(format("Attempting to load JPEG image from URL %s", filePath));
		const jpgData = JPEG.decode(C_FileSystem.readFileBinary(filePath), { useTArray: true });
		const diffuseTextureBitmap = new Bitmap(jpgData.data, jpgData.width, jpgData.height);
		// diffuseTextureBitmap.toRGBA(Enum.PIXEL_FORMAT_ABGR); // bmp-js seems to use ABGR internally, but we assume RGBA
		return diffuseTextureBitmap;
	},
};
