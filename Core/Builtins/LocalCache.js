class LocalCache {
	constructor(filePath = null) {
		this.filePath = filePath;
		this.keyValueStore = {};
	}
	getValue(key) {
		return this.keyValueStore[key];
	}
	setValue(key, value) {
		this.keyValueStore[key] = value;
	}
	evict(key) {
		delete this.keyValueStore[key];

		if(key === undefined) this.clear();
	}
	clear() {
		this.keyValueStore = {};
	}
	load() {
		this.keyValueStore = C_FileSystem.readJSON(this.filePath);
	}
	save() {
		C_FileSystem.writeJSON(this.filePath, this.keyValueStore);
	}
	getFilePath() {}
	setFilePath() {}
}