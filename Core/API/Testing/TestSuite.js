class TestSuite {
	constructor(name = new UniqueID().toString()) {
		this.name = name;
		this.directoryPrefixString = "";
		this.scenarios = {};
	}
	setDirectoryPrefix(prefixString = "") {
		this.directoryPrefixString = prefixString;
	}
	addScenario(scenarioID = new UniqueID().toString(), fileToLoad) {
		const filePath = path.join(this.directoryPrefixString, fileToLoad);
		this.scenarios[scenarioID] = this.scenarios[scenarioID] || [];
		this.scenarios[scenarioID].push(filePath);
	}
	run() {
		for (const [scenarioID, scenarioFiles] of values(this.scenarios)) {
			// We want to group all tests that belong to the same scenario
			describe(scenarioID, () => {
				for (const filePath of scenarioFiles) this.runScenarioFile(filePath);
			});
		}
	}
	runScenarioFile(filePath) {
		require(filePath);
	}
}
