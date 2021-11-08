const testCases = [
	"API/C_Settings/validate.js",
	"API/C_Settings/validateDefaultSettings.js",
	"API/C_Settings/validateUserSettings.js",
	"Builtins/LocalCacheTests.js",
]

testCases.forEach(fileName => {
	require("./" + fileName);
})
