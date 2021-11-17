const testSuites = {
	Builtins: ["Builtins/LocalCacheTests.js"],
	C_Settings: [
		"API/C_Settings/validate.js",
		"API/C_Settings/validateDefaultSettings.js",
		"API/C_Settings/validateUserSettings.js",
	],
};

for (const namespace in testSuites) {
	const testCases = testSuites[namespace];

	describe(namespace, () => {
		testCases.forEach((fileName) => {
			require("./" + fileName);
		});
	});
}
