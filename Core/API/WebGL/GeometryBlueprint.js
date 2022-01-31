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
	getPackedSize() {
		const BYTES_PER_INTEGER = 4;
		const BYTES_PER_FLOAT = 4;

		const positionsSize = this.vertices.length * BYTES_PER_FLOAT;
		const indicesSize = this.connections.length * BYTES_PER_INTEGER;
		const vertexColorsSize = this.vertexColors.length * BYTES_PER_FLOAT;
		const flatNormalsSize = this.normalVectors.length * BYTES_PER_FLOAT;
		const lightmapTexCoordsSize = this.lightmapTextureCoordinates.length * BYTES_PER_FLOAT;
		const diffuseTexCoordsSize = this.diffuseTextureCoordinates.length * BYTES_PER_FLOAT;

		const fieldCountsSize = BYTES_PER_INTEGER * 6; // The relevant arrays (all of the above)
		return (
			fieldCountsSize +
			positionsSize +
			indicesSize +
			vertexColorsSize +
			flatNormalsSize +
			lightmapTexCoordsSize +
			diffuseTexCoordsSize
		);
	}
}
