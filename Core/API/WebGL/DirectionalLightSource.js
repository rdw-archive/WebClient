class DirectionalLightSource extends LightSource {
	constructor(name = new UniqueID().toString()) {
		super(name);
		const scene = C_Rendering.getActiveScene();

		this.sceneObject = new BABYLON.DirectionalLight(name, new BABYLON.Vector3(1, -1, 1), scene);
		this.sceneObject.specular = BABYLON.Color3.Black();
		// intensity? (TBD)
	}
	setDirection(direction) {
		this.sceneObject.direction = new BABYLON.Vector3(direction.x, direction.y, direction.z);
	}
	getDirection() {
		const direction = this.sceneObject.direction;
		return new Vector3D(direction.x, direction.y, direction.z);
	}
}
