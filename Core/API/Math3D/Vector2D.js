class Vector2D {
	static length = 2;
	constructor(u = 0, v = 0) {
		this.u = u;
		this.v = v;
	}
	clone() {
		return new Vector2D(this.u, this.v);
	}
}
