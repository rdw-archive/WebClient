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

C_Navigation.isTileObstructed = function (u, v) {
	return this.navigationMap.isObstructed(u * v);
};

C_Navigation.isTileWalkable = function (u, v) {
	return this.navigationMap.isWalkable(u * v);
};

C_Navigation.getTileAltitude = function (u, v) {
	return this.heightMap.getAltitude(u * v);
};

C_Navigation.getTerrainTypeForTile = function (u, v) {
	return this.terrainMap.getTerrainType(u * v);
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
