class Vector3D {
	static ORIGIN = { x: 0, y: 0, z: 0 };
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	static normalizeInPlace(vector3D) {
		const vector = new BABYLON.Vector3(vector3D.x, vector3D.y, vector3D.z);
		vector.normalize();

		// TBD It was a NO-OP, that doesn't seem right?
		// vector3D.x = vector.x
		// vector3D.y = vector.y
		// vector3D.z = vector.z
	}
	copy() {
		return new Vector3D(this.x, this.y, this.z);
	}
}
