var format = require("util").format;

// Shorthand because I'm lazy (must be set after the localization tables have been read)
let L = {};
function StartWebClient() {
	C_Profiling.startTimer("StartWebClient");

	C_Logging.createLoggers();

	WebClient.initializeLocalizationTables();
	L = C_Locales.getLocalizationTable(WEBCLIENT_ACTIVE_LOCALE);
	WebClient.setWindowTitle(L["Loading..."]);

	C_Macro.restoreMacroCache(); // Needs to be done before addons are loaded, as they may want to interact with the cache?

	WebClient.createUserInterface();
	C_Addons.loadAddonCache();
	C_Addons.loadEnabledAddons();

	const windowTitle = format("%s (%s)", WebClient.titleString, WebClient.versionString);
	WebClient.setWindowTitle(windowTitle);

	C_EventSystem.registerEvent("SCRIPT_EXECUTION_FINISHED", "WebClient", WebClient.onScriptExecutionFinished);
}
