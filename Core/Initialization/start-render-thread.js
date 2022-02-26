function StartWebClient() {
	C_Profiling.startTimer("StartWebClient");

	WebClient.initializeLocalizationTables();
	L = C_Locales.getLocalizationTable(C_Settings.getValue("activeLocale"));
	WebClient.setWindowTitle(L["Loading..."]);

	C_Macro.restoreMacroCache(); // Needs to be done before addons are loaded, as they may want to interact with the cache?

	C_Decoding.addDecoder(new BuiltinAudioDecoder());
	C_Decoding.addDecoder(new BmpDecoder());
	C_Decoding.addDecoder(new JpegDecoder());
	C_Decoding.addDecoder(new PngDecoder());

	C_WebAudio.musicTrack.setVolume(C_Settings.getValue("musicVolume"));
	C_WebAudio.sfxTrack.setVolume(C_Settings.getValue("sfxVolume"));
	C_WebAudio.ambienceTrack.setVolume(C_Settings.getValue("ambienceVolume"));
	C_WebAudio.setGlobalVolume(C_Settings.getValue("globalVolume"));

	if (!C_Settings.getValue("enableSound")) C_WebAudio.disableSound();
	if (!C_Settings.getValue("enableMusic")) C_WebAudio.disableMusicTrack();
	if (!C_Settings.getValue("enableSFX")) C_WebAudio.disableEffectsTrack();
	if (!C_Settings.getValue("enableAmbientSounds")) C_WebAudio.disableAmbienceTrack();

	C_Addons.loadAddonCache();
	C_Addons.loadEnabledAddons();

	const windowTitle = format("%s (%s)", WebClient.titleString, WebClient.versionString);
	WebClient.setWindowTitle(windowTitle);

	C_EventSystem.registerEvent("SCRIPT_EXECUTION_FINISHED", "WebClient", WebClient.onScriptExecutionFinished);

	window.onbeforeunload = function () {
		C_EventSystem.triggerEvent("APPLICATION_SHUTDOWN");
	};

	C_EventSystem.registerEvent("APPLICATION_SHUTDOWN", "WebClient", function () {
		DEBUG("Application shutting down; performing cleanup tasks");
		C_Addons.saveAddonCache();
		C_Macro.saveMacroCache();
		C_Settings.saveSettingsCache();
	});

	WebClient.run();

	C_Profiling.endTimer("StartWebClient");
}
