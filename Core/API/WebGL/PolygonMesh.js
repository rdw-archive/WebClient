class PolygonMesh {
	constructor(name = new UniqueID().toString(), geometryBlueprint) {
		this.displayName = name;
		this.diffuseTexture = null;
		this.lightmapTexture = null;
		this.ambientOcclusionTexture = null;

		this.sceneObject = null;

		// TODO load from geometryBlueprint
		this.geometryBlueprint = geometryBlueprint;
	}
	setDiffuseTexture(diffuseTextureImage) {
		this.diffuseTexture = diffuseTextureImage;
	}
	setLightmapTexture(lightmapTextureImage) {
		this.lightmapTexture = lightmapTextureImage;
	}
	setAmbientOcclusionTexture(ambientOcclusionTextureImage) {
		this.ambientOcclusionTexture = ambientOcclusionTextureImage;
	}
	getBlueprint() {
		return this.geometryBlueprint;
	}
	setDisplayName(name) {
		this.name = name;
	}
	getDisplayName() {
		return this.displayName;
	}
	render() {
		const sceneObject = C_WebGL.createMesh(this.displayName, this.geometryBlueprint);
		C_Rendering.addMesh(this.displayName, sceneObject);

		this.sceneObject = sceneObject;
	}
	destroy() {
		C_Rendering.removeMesh(this.sceneObject);
		this.sceneObject = null;
	}
}
