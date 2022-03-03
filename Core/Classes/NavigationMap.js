class NavigationMap {
	constructor(numTiles = 1, width = 1, height = 1) {
		this.tiles = new Array(numTiles);
		this.width = width;
		this.height = height;
	}
	setObstructed(tileID) {
		this.tiles[tileID] = false;
	}
	setWalkable(tileID) {
		this.tiles[tileID] = true;
	}
	isWalkable(tileID) {
		return this.tiles[tileID];
	}
	isObstructed(tileID) {
		return !this.tiles[tileID];
	}
	getNumObstructedTiles() {
		let count = 0;
		for (let tileID = 0; tileID < this.tiles.length; tileID += 1) {
			if (this.isObstructed(tileID)) count += 1;
		}

		return count;
	}
	getNumTiles() {
		return this.tiles.length;
	}
	getNumWalkableTiles() {
		let count = 0;
		for (let tileID = 0; tileID < this.tiles.length; tileID += 1) {
			if (this.isWalkable(tileID)) count += 1;
		}

		return count;
	}
	toBitmap() {
		const pixelData = [];
		for (let tileID = 0; tileID < this.tiles.length; tileID++) {
			const tile = this.tiles[tileID];
			const isTileObstructed = tile === false;

			if (isTileObstructed) pixelData.push(0, 0, 0, 0);
			else pixelData.push(255, 255, 255, 255);
		}

		const bitmap = new Bitmap(pixelData, this.width, this.height);
		bitmap.flipHorizontally(); // Tiles start at the bottom, but bitmap pixels start at the top

		return bitmap;
	}
}
