describe("destroyInstancedMeshes", () => {
	it("should destroy any instanced meshes that were created from the prototype", () => {
		const rootMeshID = new UniqueID().toString();
		C_WebGL.createInstancedMesh(rootMeshID, new GeometryBlueprint());
		C_WebGL.createInstancedMesh(rootMeshID);
		C_WebGL.createInstancedMesh(rootMeshID);

		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Prototype"));
		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Instance1"));
		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Instance2"));
		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Instance3"));

		C_WebGL.destroyInstancedMeshes(rootMeshID);

		assertNull(C_Rendering.getSceneObjectByName(rootMeshID + "#Prototype"));
		assertNull(C_Rendering.getSceneObjectByName(rootMeshID + "#Instance1"));
		assertNull(C_Rendering.getSceneObjectByName(rootMeshID + "#Instance2"));
		assertNull(C_Rendering.getSceneObjectByName(rootMeshID + "#Instance3"));
	});

	it("should remove the prototype mesh itself from the scene", () => {
		const numMeshesBefore = C_Rendering.getNumActiveMeshes();
		const numMaterialsBefore = C_Rendering.getNumActiveMaterials();

		const rootMeshID = new UniqueID().toString();
		C_WebGL.createInstancedMesh(rootMeshID, new GeometryBlueprint());
		assertEquals(C_Rendering.getNumActiveMeshes(), numMeshesBefore + 2); // Prototype + first instance
		assertEquals(C_Rendering.getNumActiveMaterials(), numMaterialsBefore + 1); // Shared material

		C_WebGL.destroyInstancedMeshes(rootMeshID);

		assertEquals(C_Rendering.getNumActiveMeshes(), numMeshesBefore);
		assertEquals(C_Rendering.getNumActiveMaterials(), numMaterialsBefore);
	});

	it("should do nothing if no prototype exists with the given ID", () => {
		const numSceneObjects = C_Rendering.getNumSceneObjects();
		C_WebGL.destroyInstancedMeshes("invalid root mesh ID");
		assertEquals(C_Rendering.getNumSceneObjects(), numSceneObjects);
	});
});
