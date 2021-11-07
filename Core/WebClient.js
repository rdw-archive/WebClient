var format = require("util").format;

// Global shorthand for the render thread (visible window)
class WebClient {
	static titleString = "Revival WebClient";
	static versionString = "v" + require("./package.json").version;

	static defaultFrames = [
		"ViewportContainer",
		"WorldFrame",
		"UIParent",
		"FpsCounterFrame",
		"KeyboardInputFrame",
		"GameMenuFrame",
		"AddonOptionsFrame",
	];
	static settings = {};
	static nextAvailableGUID = 1;
	// Sets the window title of the application window
	// @param title The new title to be displayed
	static setWindowTitle(title) {
		document.title = title;
		INFO(format("Set window title to: %s", title));
	}
	// Create localization tables for all supported locales
	static initializeLocalizationTables() {
		DEBUG("Initializing localization systems");
		for (const localeString in WEBCLIENT_SUPPORTED_LOCALES) {
			// DEBUG(format("Setting up lookup tables for locale %s", localeString));
			C_Locales.registerNewLocale(localeString);
			this.loadTranslatedPhrases(localeString);
		}
	}
	static loadTranslatedPhrases(localeString) {
		// DEBUG(format("Loading localized phrases for locale %s", localeString));

		// Read translation phrases
		const filePath = format("%s/%s.json", WEBCLIENT_LOCALES_DIR, localeString);
		const localizationTable = C_FileSystem.readJSON(filePath);
		C_Locales.updateLocalizationTable(localeString, localizationTable);
	}
	// Loads (synchronously) a script and appends it to the rendered document (which immediately executes it)
	static loadScript(URL, onLoadedCallback) {
		DEBUG(format("Loading script from URL %s", URL));
		const script = document.createElement("script");
		script.onload = function () {
			DEBUG("Script " + URL + " is now loaded");
			// tbd redunant or keep for async API?
			C_EventSystem.triggerEvent("SCRIPT_EXECUTION_FINISHED", URL);
			if (typeof onLoadedCallback === "function") onLoadedCallback();
		};

		script.src = URL;
		script.async = false; // We want it to block so that dependent scripts (e.g., widgets, addons) aren't racing their dynamically-loaded dependencies
		document.head.appendChild(script);
	}
	static loadStylesheet(URL, onLoadedCallback) {
		DEBUG(format("Loading stylesheet from URL %s", URL));

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = URL;
		link.media = "all";

		link.onload = function () {
			DEBUG("Stylesheet " + URL + " is now loaded");
			C_EventSystem.triggerEvent("STYLESHEET_LOADING_FINISHED", URL);
			if (typeof onLoadedCallback === "function") onLoadedCallback();
		};

		document.head.appendChild(link);
	}
	static loadManifest() {
		const filePath = WEBCLIENT_ROOT_DIR + "/TOC.json";
		DEBUG("Loading application manifest from " + filePath);
		this.metadata = C_FileSystem.readJSON(filePath);
	}
	// Load basic interface
	static createUserInterface() {
		for (const fileName of this.defaultFrames) {
			DEBUG(format("Creating default interface component %s", fileName));
			this.loadScript(format(WEBCLIENT_INTERFACE_DIR + "/Frames/" + fileName + ".js"));
		}
	}
	// Defer render loop until the WorldFrame (canvas) exists
	static onScriptExecutionFinished(event, URL) {
		// Kinda ugly, but alas. It's better than entering callback hell and sync loading doesn't work at all for this
		DEBUG(format("SCRIPT_EXECUTION_FINISHED triggered for URL %s", URL));
		if (URL !== WEBCLIENT_INTERFACE_DIR + "/Frames/WorldFrame.js") return;

		// process.on("exit", function () {
		window.onbeforeunload = function () {
			C_EventSystem.triggerEvent("APPLICATION_SHUTDOWN");
		};

		C_EventSystem.registerEvent("APPLICATION_SHUTDOWN", "WebClient", function () {
			DEBUG("Application shutting down; performing cleanup tasks");
			C_Addons.saveAddonCache();
			C_Macro.saveMacroCache();
		});

		WebClient.run();
	}
	// Starts the client application
	static run() {
		C_Profiling.endTimer("StartWebClient");

		function processMessageQueue() {
			let numProcessedMessages = 0;
			let nextMessage = null;
			while ((nextMessage = C_Message.getNextUnprocessedMessage()) !== undefined) {
				DEBUG(format("Processing new message %s", nextMessage));
				C_Message.processResponse(nextMessage);
				numProcessedMessages++;
			}
			if (numProcessedMessages > 0) DEBUG(format("Finished processing %d new message(s)", numProcessedMessages));
		}

		function processIncomingMessage(event, messageString) {
			C_Message.storeUnprocessedMessage(messageString);
		}
		C_EventSystem.registerEvent("WEBSOCKET_INCOMING_MESSAGE", "WebClient", processIncomingMessage);
		C_EventSystem.registerEvent("RENDER_LOOP_UPDATE", "WebClient", processMessageQueue);

		DEBUG("Starting the render loop");
		C_Rendering.startRenderLoop();
	}
	// When a unique ID is required, but the exact ID that is assigned doesn't matter, this convenience method can be used
	static getNextAvailableGUID() {
		this.nextAvailableGUID++;
		return this.nextAvailableGUID - 1;
	}
}
