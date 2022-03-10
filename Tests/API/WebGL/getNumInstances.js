describe("getNumInstances", () => {
	const rootMeshID = "PrototypeMesh1";
	const blueprint = new GeometryBlueprint(); // Can be empty; we don't need any actual geometry here

	it("should return the number of mesh instances for a given prototype", () => {
		// The prototype itself isn't visible and therefore not counted
		assertEquals(C_WebGL.getNumInstances(rootMeshID), 0);
		C_WebGL.createInstancedMesh(rootMeshID, blueprint);
		assertEquals(C_WebGL.getNumInstances(rootMeshID), 1);
		C_WebGL.createInstancedMesh(rootMeshID);
		assertEquals(C_WebGL.getNumInstances(rootMeshID), 2);
		C_WebGL.createInstancedMesh(rootMeshID);
		assertEquals(C_WebGL.getNumInstances(rootMeshID), 3);

		// Cleanup
		C_WebGL.destroyInstancedMeshes(rootMeshID);
		assertEquals(C_WebGL.getNumInstances(rootMeshID), 0);
	});

	it("should return zero if no prototype exists with the given ID", () => {
		assertEquals(C_WebGL.getNumInstances("invalidRootMeshID"), 0);
	});

	after(() => C_WebGL.destroyInstancedMeshes(rootMeshID));
});
