class TerrainMap {
	constructor(numTiles = 1, width = 1, height = 1) {
		this.tiles = new Array(numTiles);
		this.width = width;
		this.height = height;
	}
	setTerrainType(tileID, terrainType) {
		this.tiles[tileID] = terrainType;
	}
	getTerrainType(tileID) {
		return this.tiles[tileID];
	}
	getNumTiles() {
		return this.tiles.length;
	}
	getNumTilesByTerrainType(terrainTypeID) {
		let count = 0;
		for (let tileID = 0; tileID < this.tiles.length; tileID += 1) {
			if (this.getTerrainType(tileID) === terrainTypeID) count += 1;
		}

		return count;
	}
	toBitmap() {
		const pixelData = [];

		for (let tileID = 0; tileID < this.tiles.length; tileID++) {
			const terrainTypeID = this.tiles[tileID] || 0;
			const color = Color.TERRAIN_VISUALIZATION_COLORS[terrainTypeID];
			pixelData.push(color.red, color.green, color.blue, 255);
		}

		const bitmap = new Bitmap(pixelData, this.width, this.height);
		bitmap.flipHorizontally(); // Tiles start at the bottom, but bitmap pixels start at the top

		return bitmap;
	}
}
