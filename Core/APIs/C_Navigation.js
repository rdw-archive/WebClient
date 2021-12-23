var format = require("util").format;

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

C_Navigation.getTerrainAltitude = function (u, v) {
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

//  Transforms a set of 2D map coordinates into the 3D render coordinates used to locate the center of a unit in the world.
// -- Note: The center is of critical importance for displaying units properly because 2D sprites will be placed there,
// and later shifted or updated to simulate different camera POVs on said center point
C_Navigation.getWorldCoordinates = function (mapU, mapV) {
	const worldCoordinates = {
		worldX: mapU - 0.5,
		worldY: this.getTerrainAltitude(mapU, mapV),
		worldZ: mapV - 0.5,
	};
	return worldCoordinates;
};

// --- Transforms a set of 3D render coordinates into the 2D map coordinates used to place units in the world.
// -- This is mainly useful to determine what tile in the map a click should refer, or possibly later for the center of a unit
C_Navigation.getMapCoordinates = function (worldX, worldY, worldZ) {
	const mapCoordinates = {
		mapU: Math.ceil(worldX + 0.5),
		mapV: Math.ceil(worldZ + 0.5),
	};
	return mapCoordinates;
};
