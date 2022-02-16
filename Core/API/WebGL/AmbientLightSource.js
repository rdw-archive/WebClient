class AmbientLightSource extends LightSource {
	constructor(name = new UniqueID().toString()) {
		super(name);

		const scene = C_Rendering.getActiveScene();
		this.sceneObject = new BABYLON.HemisphericLight(name, new BABYLON.Vector3(0, 1, 0), scene);
		this.sceneObject.specular = BABYLON.Color3.Black();
		this.sceneObject.diffuse = new BABYLON.Color3(1, 1, 1);
		this.sceneObject.ground = new BABYLON.Color3(1, 1, 1);
		this.sceneObject.intensity = 1;
	}

	getShadowColor() {
		const shadowColor = this.sceneObject.ground;
		return new Color(shadowColor.r * 255, shadowColor.g * 255, shadowColor.b * 255);
	}
	setShadowColor(color) {
		this.sceneObject.ground = new BABYLON.Color3(color.red / 255, color.green / 255, color.blue / 255);
	}
}
