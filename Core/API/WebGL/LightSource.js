class LightSource {
	constructor(name = new UniqueID().toString()) {
		this.name = name;
	}
	setDiffuseColor(color) {
		this.sceneObject.diffuse = new BABYLON.Color3(color.red / 255, color.green / 255, color.blue / 255);
	}
	getDiffuseColor() {
		const diffuseColor = this.sceneObject.diffuse;
		return new Color(diffuseColor.r * 255, diffuseColor.g * 255, diffuseColor.b * 255);
	}
	getSpecularHighlightsColor() {
		const specularColor = this.sceneObject.specular;
		return new Color(specularColor.r * 255, specularColor.g * 255, specularColor.b * 255);
	}
	getWorldPosition() {
		return new Vector3D(this.sceneObject.position.x, this.sceneObject.position.y, this.sceneObject.position.z);
	}
	setWorldPosition(worldX, worldY, worldZ) {
		this.sceneObject.position.x = worldX;
		this.sceneObject.position.y = worldY;
		this.sceneObject.position.z = worldZ;
	}
	getIntensity() {
		return this.sceneObject.intensity;
	}
	setIntensity(intensity) {
		this.sceneObject.intensity = intensity;
	}
}
