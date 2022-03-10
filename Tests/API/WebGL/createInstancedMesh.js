describe("createInstancedMesh", () => {
	const rootMeshID = new UniqueID().toString();
	it("should create a prototype if none was previously created", () => {
		const numMeshesBefore = C_Rendering.getNumActiveMeshes();
		const numMaterialsBefore = C_Rendering.getNumActiveMaterials();
		assertNull(C_Rendering.getSceneObjectByName(rootMeshID + "#Prototype"));

		C_WebGL.createInstancedMesh(rootMeshID, new GeometryBlueprint());

		const rootMesh = C_WebGL.getInstantiationPrototype(rootMeshID);
		assertFalse(rootMesh.isShown());

		const numMeshesAfter = C_Rendering.getNumActiveMeshes();
		const numMaterialsAfter = C_Rendering.getNumActiveMaterials();

		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Prototype"));
		assertEquals(numMeshesAfter, numMeshesBefore + 2); // One instance, and the prototype itself
		assertEquals(numMaterialsAfter, numMaterialsBefore + 1); // One material, shared between all instances
	});

	it("should return a mesh representation of the given geometry", () => {
		const blueprint = new GeometryBlueprint();
		const instance = C_WebGL.createInstancedMesh(rootMeshID, blueprint);
		assertTrue(instance instanceof PolygonMesh);
	});

	it("should use the existing prototype if one was previously created", () => {
		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Prototype"));
		const numMeshesBefore = C_Rendering.getNumActiveMeshes();
		const numMaterialsBefore = C_Rendering.getNumActiveMaterials();

		C_WebGL.createInstancedMesh(rootMeshID, new GeometryBlueprint());
		const numMeshesAfter = C_Rendering.getNumActiveMeshes();
		const numMaterialsAfter = C_Rendering.getNumActiveMaterials();

		assertNotUndefined(C_Rendering.getSceneObjectByName(rootMeshID + "#Prototype"));
		assertEquals(numMeshesAfter, numMeshesBefore + 1); // Only one instance, no new prototype
		assertEquals(numMaterialsAfter, numMaterialsBefore); // The shared material should be used
	});

	after(() => C_WebGL.destroyInstancedMeshes(rootMeshID));
});
