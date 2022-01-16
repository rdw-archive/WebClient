class GeometryBlueprint {
	constructor() {
		this.vertices = [];
		this.connections = [];
		this.vertexColors = [];
		this.normalVectors = [];
		this.diffuseTextureCoordinates = [];
		this.lightmapTextureCoordinates = []; // Also used for the ambient occlusion map (for now)

		this.lightmapTextureImage = null;
		this.ambientOcclusionTextureImage = null;
		this.diffuseTextureImage = null;

		// TODO tests
		this.flipTextureImages = true;
		// this.wireframe= false
		// this.checkCollisions
		// this.billboardMode
		// this.showBoundingBox
	}
}
