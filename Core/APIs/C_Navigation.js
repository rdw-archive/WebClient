const C_Navigation = {
	navigationMap: new NavigationMap(),
	heightMap: new HeightMap(),
	terrainMap: new TerrainMap(),
};

C_Navigation.setNavigationMap = function (navMap) {
	DEBUG(format("Using new navigation map with %d tiles", navMap.tiles.length));
	this.navigationMap = navMap;
};

C_Navigation.setHeightMap = function (heightMap) {
	DEBUG(format("Using new height map with %d tiles", heightMap.tiles.length));
	this.heightMap = heightMap;
};

C_Navigation.setTerrainMap = function (terrainMap) {
	DEBUG(format("Using new terrain map with %d tiles", terrainMap.tiles.length));
	this.terrainMap = terrainMap;
};

C_Navigation.isTileObstructed = function (mapU, mapV) {
	return this.navigationMap.isObstructed(this.getTileIndexFromMapPosition(mapU, mapV));
};

C_Navigation.isTileWalkable = function (mapU, mapV) {
	return this.navigationMap.isWalkable(this.getTileIndexFromMapPosition(mapU, mapV));
};

C_Navigation.getTerrainAltitude = function (mapU, mapV) {
	return this.heightMap.getAltitude(this.getTileIndexFromMapPosition(mapU, mapV));
};

C_Navigation.getTileIndexFromMapPosition = function (mapU, mapV) {
	// Map coordinates start at (1, 1) but array indices start at zero
	const offsetU = mapU - 1;
	const offsetV = (mapV - 1) * this.heightMap.width;
	return offsetU + offsetV;
};

C_Navigation.getTerrainTypeForTile = function (mapU, mapV) {
	return this.terrainMap.getTerrainType(this.getTileIndexFromMapPosition(mapU, mapV));
};

C_Navigation.getNavigationMap = function () {
	return this.navigationMap;
};

C_Navigation.getHeightMap = function () {
	return this.heightMap;
};

C_Navigation.getTerrainMap = function () {
	return this.terrainMap;
};
