class UniqueID {
	constructor() {
		this.identifier = UUID.v4();
	}
	toString() {
		return this.identifier;
	}
}
