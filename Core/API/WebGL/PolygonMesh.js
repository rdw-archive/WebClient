class PolygonMesh {
	constructor(meshBlueprint) {
		this.textureFilePath = null;
		this.lightmapTextureFilePath = null;
		this.ambientTextureFilePath = null;

		this.vertices = [];
		this.connections = [];
		this.vertexColors = [];
		this.textureCoordinates = [];
		this.flatNormals = [];
		this.smoothNormals = [];
		this.lightmapUVs = []; // Also used for the ambient occlusion map (for now)
	}
	setLightmapTexturePath(textureFilePath) {
		this.lightmapTextureFilePath = textureFilePath;
	}
	setAmbientOcclusionTexturePath(textureFilePath) {
		this.ambientTextureFilePath = textureFilePath;
	}
	setDiffuseTexturePath(textureFilePath) {
		this.textureFilePath = textureFilePath;
	}
	render() {}
	destroy() {}
}
