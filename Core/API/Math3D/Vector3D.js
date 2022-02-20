class Vector3D {
	static ORIGIN = new Vector3D(0, 0, 0);
	static length = 3;
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	normalizeInPlace() {
		this.coordinates.normalize();
	}
	clone() {
		return new Vector3D(this.x, this.y, this.z);
	}
	static add(...vectors) {
		const result = new Vector3D(0, 0, 0);
		vectors.reduce((previous = result, current) => {
			result.x = previous.x + current.x;
			result.y = previous.y + current.y;
			result.z = previous.z + current.z;
		});
		return result;
	}
}
