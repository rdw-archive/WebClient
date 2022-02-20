const testSuites = {
	SharedConstants: ["SharedConstants/Aliases.js", "SharedConstants/Paths.js"],
	Builtins: [
		"Builtins/Assertions.js",
		"Builtins/LocalCacheTests.js",
		"Builtins/AudioTrack.js",
		"Builtins/Decoder.js",
		"Builtins/UniqueID.js",
		"Builtins/Resource.js",
		"Builtins/Validators.js",
	],
	C_Decoding: ["API/C_Decoding/BuiltinJsonDecoder.js"],
	C_LoadingScreen: ["API/C_LoadingScreen/test-async-task-scheduling.js"],
	C_Math3D: ["API/Math3D/test-vector2d.js", "API/Math3D/test-vector3d.js", "API/Math3D/test-api-surface.js"],
	C_Settings: [
		"API/C_Settings/getValue.js",
		"API/C_Settings/setValue.js",
		"API/C_Settings/validate.js",
		"API/C_Settings/validateDefaultSettings.js",
		"API/C_Settings/validateUserSettings.js",
	],
	C_WebAudio: [
		"API/C_WebAudio/BuiltinAudioDecoder.js",
		"API/C_WebAudio/playMusic.js",
		"API/C_WebAudio/stopMusic.js",
		"API/C_WebAudio/setGlobalVolume.js",
		"API/C_WebAudio/getGlobalVolume.js",
		"API/C_WebAudio/getMusicVolume.js",
		"API/C_WebAudio/setMusicVolume.js",
		"API/C_WebAudio/getEffectsVolume.js",
		"API/C_WebAudio/setEffectsVolume.js",
		"API/C_WebAudio/getAmbienceVolume.js",
		"API/C_WebAudio/setAmbienceVolume.js",
		"API/C_WebAudio/getSupportedFileFormats.js",
		"API/C_WebAudio/canPlayMP3.js",
		"API/C_WebAudio/canPlayOGG.js",
		"API/C_WebAudio/canPlayWAV.js",
		"API/C_WebAudio/isAudioAvailable.js",
		"API/C_WebAudio/isAudioContextInitialized.js",
	],
	C_Macro: ["API/Macro/restoreMacroCache.js"],
	C_Resources: ["API/Resources/test-resource-builtin.js"],
};

for (const namespace in testSuites) {
	const testCases = testSuites[namespace];

	describe(namespace, () => {
		testCases.forEach((fileName) => {
			require("./" + fileName);
		});
	});
}
