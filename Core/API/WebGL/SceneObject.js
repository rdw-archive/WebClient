class SceneObject {
	constructor(name) {
		this.displayName = name
	}
	render() {
		throw new Error("Cannot render scene object " + this.displayName + " (abstract prototype)")
	}
	remove() {
		throw new Error("Cannot remove scene object " + this.displayName + " (abstract prototype)")
	}
}
