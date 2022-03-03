describe("unsetNavigationMap", () => {
	it("should remove the current navigation map if any was previously set", () => {
		C_Navigation.setNavigationMap(new NavigationMap(42, 1, 42));
		assertTrue(C_Navigation.getNavigationMap() instanceof NavigationMap);

		C_Navigation.unsetNavigationMap();
		assertNull(C_Navigation.getNavigationMap());
	});
});

describe("unsetHeightMap", () => {
	it("should remove the current height map if any was previously set", () => {
		C_Navigation.setHeightMap(new HeightMap(42, 1, 42));
		assertTrue(C_Navigation.getHeightMap() instanceof HeightMap);

		C_Navigation.unsetHeightMap();
		assertNull(C_Navigation.getHeightMap());
	});
});

describe("unsetTerrainMap", () => {
	it("should remove the current terrain map if any was previously set", () => {
		C_Navigation.setTerrainMap(new TerrainMap(42, 1, 42));
		assertTrue(C_Navigation.getTerrainMap() instanceof TerrainMap);

		C_Navigation.unsetTerrainMap();
		assertNull(C_Navigation.getTerrainMap());
	});
});

describe("getTileIndexFromMapPosition", () => {
	it("should compute the index that corresponds to the tile at the given map coordinates", () => {
		C_Navigation.setHeightMap(new HeightMap(42, 1, 42));
		assertEquals(C_Navigation.getTileIndexFromMapPosition(1, 1), 0);
		assertEquals(C_Navigation.getTileIndexFromMapPosition(2, 1), 1);
	});
});

describe("getWorldCoordinates", () => {
	it("should return the world coordinates that correspond to the given map position", () => {
		assertEquals(C_Navigation.getWorldCoordinates(1, 1), new Vector3D(0.5, 0, 0.5));
		assertEquals(C_Navigation.getWorldCoordinates(42, 42), new Vector3D(41.5, 0, 41.5));
	});

	it("should use the current height map to look up tile altitudes", () => {
		// Setup
		const heightMap = new HeightMap(42 * 42, 42, 42);
		heightMap.setAltitude(0, 123);
		heightMap.setAltitude(19, 456); // First row (map position: 20, 1)
		heightMap.setAltitude(42, 789); // Second row (map position: 1, 2)
		C_Navigation.setHeightMap(heightMap);

		assertEquals(C_Navigation.getWorldCoordinates(1, 1), new Vector3D(0.5, 123, 0.5));
		assertEquals(C_Navigation.getWorldCoordinates(20, 1), new Vector3D(19.5, 456, 0.5));
		assertEquals(C_Navigation.getWorldCoordinates(1, 2), new Vector3D(0.5, 789, 1.5));

		// Teardown
		C_Navigation.unsetHeightMap();
	});
});

describe("getMapCoordinates", () => {
	it("should return the map position that correspond to the given world coordinates", () => {
		assertEquals(C_Navigation.getMapCoordinates(0, 0, 0), new Vector2D(1, 1));
		assertEquals(C_Navigation.getMapCoordinates(0.5, 0, 0.5), new Vector2D(1, 1));
		assertEquals(C_Navigation.getMapCoordinates(1, 0, 1), new Vector2D(2, 2));

		assertEquals(C_Navigation.getMapCoordinates(41.5, 0, 41.5), new Vector2D(42, 42));

		assertEquals(C_Navigation.getMapCoordinates(0, 555, 0), new Vector2D(1, 1));
		assertEquals(C_Navigation.getMapCoordinates(0.5, -555, 0.5), new Vector2D(1, 1));
		assertEquals(C_Navigation.getMapCoordinates(1, null, 1), new Vector2D(2, 2));
	});
});
