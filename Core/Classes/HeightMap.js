class HeightMap {
	constructor(numTiles = 1, width = 1, height = 1) {
		this.tiles = new Array(numTiles);
		this.width = width;
		this.height = height;
	}
	setAltitude(tileID, altitude) {
		this.tiles[tileID] = altitude;
	}
	getAltitude(tileID) {
		return this.tiles[tileID];
	}
	getMinimumAltitude() {
		let min = Number.MAX_SAFE_INTEGER;

		for (let tileID = 0; tileID < this.tiles.length; tileID += 1) {
			const altitude = this.getAltitude(tileID);
			if (altitude < min) min = altitude;
		}

		return min;
	}
	getMaximumAltitude() {
		let max = Number.MIN_SAFE_INTEGER;

		for (let tileID = 0; tileID < this.tiles.length; tileID += 1) {
			const altitude = this.getAltitude(tileID);
			if (altitude > max) max = altitude;
		}

		return max;
	}
	getAverageAltitude() {
		let avg = 0;

		for (let tileID = 0; tileID < this.tiles.length; tileID += 1) {
			const altitude = this.getAltitude(tileID);
			// Simple moving average, to avoid potential overflow issues while summarizing
			avg += (1 / this.tiles.length) * altitude;
		}

		return avg;
	}
	getNumTiles() {
		return this.tiles.length;
	}
	toBitmap(fileName = "HeightMap.bmp") {
		const pixelData = [];

		let maxHeight = Number.MIN_SAFE_INTEGER;
		let minHeight = Number.MAX_SAFE_INTEGER;

		for (let tileID = 0; tileID < this.tiles.length; tileID++) {
			const height = this.tiles[tileID];
			minHeight = Math.min(minHeight, height);
			maxHeight = Math.max(maxHeight, height);
		}

		for (let tileID = 0; tileID < this.tiles.length; tileID++) {
			const height = this.tiles[tileID];
			const relativeHeightPercentage = (height + (maxHeight - minHeight) / 2) / (maxHeight - minHeight);
			const relativePixelAlpha = Math.trunc(relativeHeightPercentage * 255);
			pixelData.push(relativePixelAlpha, relativePixelAlpha, relativePixelAlpha, relativePixelAlpha);
		}

		const bitmap = new Bitmap(pixelData, this.width, this.height);
		bitmap.flipHorizontally();

		if (fileName !== null) C_Bitmap.export(fileName, bitmap);

		return bitmap;
	}
}
