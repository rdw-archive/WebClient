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
	toBitmap() {
		const pixelData = [];

		for (let tileID = 0; tileID < this.tiles.length; tileID++) {
			const terrainTypeID = this.tiles[tileID] || 0;
			const color = Color.TERRAIN_VISUALIZATION_COLORS[terrainTypeID];
			pixelData.push(255, color.red, color.green, color.blue);
		}

		const bitmap = new Bitmap(pixelData, this.width, this.height);
		bitmap.flipHorizontally(); // Tiles start at the bottom, but bitmap pixels start at the top

		return bitmap;
	}
}
