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
				for (const filePath of scenarioFiles) {
					this.runScenarioFile(filePath);

					// It will be no fun troubleshooting failing tests if there could be side effects introduced by other tests
					// We should probably assert even more things here to insist on a truly blank slate, but for now it'll do
					if (C_Resources.getNumCachedResources() !== 0) this.#raiseResourceCacheNotEmptyError(scenarioID, filePath)

						if (C_Rendering.getNumActiveMeshes() !== 0) this.#raiseSceneObjectsNeedCleanupError(scenarioID, filePath)
						if (C_Rendering.getNumActiveMaterials() !== 0) this.#raiseSceneObjectsNeedCleanupError(scenarioID, filePath)
						if (C_Rendering.getNumActiveTextures() !== 0) this.#raiseSceneObjectsNeedCleanupError(scenarioID, filePath)

				}

			});
		}
	}
	runScenarioFile(filePath) {
		require(filePath);
	}
	#raiseSceneObjectsNeedCleanupError(scenarioID, filePath) {
		C_Rendering.enumerateActiveMeshes()
		throw new Error(
			"What's this? The rendered scene should be empty after each test run! Did someone not clean up after themselves?\nI think this may be the culprit (but I could be wrong. To err is, uhm, computer, after all...):\n\n" +
				"Scenario:\t" +
				scenarioID +
				"\nFound in:\t" +
				filePath +
				"\n\nBad! Very bad! I hope you were planning to clean this up, because I'm not doing my job until you do ;)"
		);
	}
	#raiseResourceCacheNotEmptyError(scenarioID, filePath) {
		throw new Error(
			"What's this? The resource cache should be empty after each test run! Did someone not clean up after themselves?\nI think this may be the culprit (but I could be wrong. To err is, uhm, computer, after all...):\n\n" +
				"Scenario:\t" +
				scenarioID +
				"\nFound in:\t" +
				filePath +
				"\n\nBad! Very bad! I hope you were planning to clean this up, because I'm not doing my job until you do ;)"
		);
	}
}
