const C_Addons = {
	ADDON_CACHE_FILE_PATH: WEBCLIENT_INTERFACE_DIR + "/addon-cache.json",
	addonCache: {}, // Loaded state for each addon - seems awkard?
	loadedAddons: {}, // metadata (loaded only)
	installedAddons: {}, // metadata (all addons)
	loadEnabledAddons() {
		DEBUG("Loading enabled addons");
		const installedAddons = C_Addons.getInstalledAddons();
		this.installedAddons = installedAddons;
		for (const addonName of installedAddons) {

			this.loadAddonMetadata(addonName); // We want to be aware of even the disabled ones
			let isEnabled = this.isAddonEnabled(addonName);

			DEBUG(format("Addon %s is set to enabled = %s", addonName, isEnabled));
			if (!isEnabled) {
				DEBUG(format("Skipped loading of disabled addon %s", addonName));
				continue;
			}
			C_Addons.loadAddon(addonName);
		}
	},
	loadAddon(addonName) {
		DEBUG(format("Loading addon %s from disk", addonName));

		const addonMetadata = this.getAddonMetadata(addonName);
		this.loadedAddons[addonName] = addonMetadata;

		// Make sure all files are loaded before the addon is actually ready to be used
		let numFilesRemaining = addonMetadata.files.length;
		function onFileLoadedCallback() {
			numFilesRemaining = numFilesRemaining - 1;
			if (numFilesRemaining === 0) C_EventSystem.triggerEvent("ADDON_LOADED", addonName);
		}

		// Load all files in order
		const addonFolder = WEBCLIENT_ADDONS_DIR + "/" + addonName + "/";
		for (const loadIndex in addonMetadata.files) {
			const fileName = addonMetadata.files[loadIndex];
			const fileType = C_Decoding.getFileType(fileName);
			if (fileType === "js") WebClient.loadScript(addonFolder + fileName, onFileLoadedCallback); // ... loadScriptAsync
			if (fileType === "css") WebClient.loadStylesheet(addonFolder + fileName, onFileLoadedCallback); // loadStylesheetAsync
		}
	},
	getInstalledAddons() {
		const addonFolders = C_FileSystem.getFilesInFolder(WEBCLIENT_ADDONS_DIR);
		const installedAddons = [];
		for (const index in addonFolders) {
			const fileName = addonFolders[index];
			if (this.isAddonLoadable(fileName)) installedAddons.push(fileName);
		}
		return installedAddons;
	},
	isAddonLoadable(addonName) {
		if (!this.isAddonLoaded(addonName)) this.loadAddonMetadata(addonName);

		const addonMetadata = this.getAddonMetadata(addonName);
		if (!addonMetadata) return false;

		const isValidMetadata = C_Validation.validateAddonMetadata(addonMetadata);

		if (!isValidMetadata) return false;

		return true;
	},
	loadAddonMetadata(addonName) {
		// loadAddonManifest, getAddonManifest
		const manifestFilePath = WEBCLIENT_ADDONS_DIR + "/" + addonName + "/contents.json";

		if (!C_FileSystem.fileExists(manifestFilePath)) {
			WARNING(format("Failed to load addon manifest from URL %s  (contents.json not found)", manifestFilePath));
			return false;
		}

		const addonMetadata = C_FileSystem.readJSON(manifestFilePath);
		this.installedAddons[addonName] = addonMetadata;

		return true;
	},
	getAddonMetadata(addonName, fieldName = null) {
		const addonMetadata = this.installedAddons[addonName];
		if (!addonMetadata) return null;

		if (!fieldName) return addonMetadata;
		return addonMetadata[fieldName];
	},
	isAddonLoaded(addonName) {
		return this.loadedAddons[addonName] !== undefined;
	},
	isAddonEnabled(addonName) {
		const addonCache = this.addonCache;
		const isLoadedStateCached = addonCache[addonName] !== undefined;

		let isEnabled = addonCache[addonName];
		if (!isLoadedStateCached && WEBCLIENT_LOAD_ADDONS_AUTOMATICALLY) isEnabled = true;

		return isEnabled;
	},
	loadAddonCache() {
		DEBUG("Loading addon cache");
		if (!C_FileSystem.fileExists(this.ADDON_CACHE_FILE_PATH)) {
			this.addonCache = {};
			DEBUG("Re-created addon cache since it couldn't be read from disk");
			return;
		}
		const addonCache = C_FileSystem.readJSON(this.ADDON_CACHE_FILE_PATH);
		this.addonCache = addonCache;
		return addonCache;
	},
	saveAddonCache() {
		DEBUG(format("Saving addon cache to file %s", this.ADDON_CACHE_FILE_PATH));
		C_FileSystem.writeJSON(this.ADDON_CACHE_FILE_PATH, this.addonCache);
	},
	enableAddon(addonName) {
		this.setAddonEnabledState(addonName, true);
		DEBUG(format("Enabled addon %s (will attempt to load immediately)", addonName));
		C_EventSystem.triggerEvent("ADDON_ENABLED", addonName);

		if (!WEBCLIENT_LOAD_ADDONS_AUTOMATICALLY) return;

		if (!this.isAddonLoadable(addonName)) return;

		if (this.isAddonLoaded(addonName)) return;

		this.loadAddon(addonName);
	},
	disableAddon(addonName) {
		if (!this.isAddonLoadable(addonName)) return;
		this.setAddonEnabledState(addonName, false);
		DEBUG(format("Disabled addon %s (restart required)", addonName));
		C_EventSystem.triggerEvent("ADDON_DISABLED", addonName);
	},
	setAddonEnabledState(addonName, enabledState) {
		this.addonCache[addonName] = enabledState;
	},
	getAddonInfo(addonName) {
		return this.loadedAddons[addonName];
	},
};
