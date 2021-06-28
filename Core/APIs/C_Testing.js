const C_Testing = {
	testSuites: [],
};

C_Testing.addTestSuite = function(testFilePath) {
	DEBUG(format("Added new test suite %s", testFilePath));
	this.testSuites.push(testFilePath);
};

C_Testing.loadAddonTests = function() {
	for (const suite of this.testSuites) WebClient.loadScript(suite);
};
