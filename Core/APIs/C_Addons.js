const C_Addons = {
	loadedAddons: {},
	loadAddon(addonName) {
		DEBUG(format("Loading addon %s from disk", addonName));

		// Load table of contents (manifest)
		const filePath = WEBCLIENT_ADDONS_DIR + "/" + addonName + "/";
		const addonMetadata = C_FileSystem.readJSON(filePath + "/contents.json");
		this.loadedAddons[addonName] = addonMetadata;

		// Make sure all files are loaded before the addon is actually ready to be used
		let numFilesRemaining = addonMetadata.files.length;
		function onFileLoadedCallback() {
			numFilesRemaining = numFilesRemaining - 1;
			if (numFilesRemaining === 0) C_EventSystem.triggerEvent("ADDON_LOADED", addonName);
		}

		// Load all files in order
		for (const loadIndex in addonMetadata.files) {
			const fileName = addonMetadata.files[loadIndex];
			const fileType = C_Decoding.getFileType(fileName);
			if (fileType === "js") WebClient.loadScript(filePath + fileName, onFileLoadedCallback);
			if (fileType === "css") WebClient.loadStylesheet(filePath + fileName, onFileLoadedCallback);
		}
	},
	getInstalledAddons() {
		const addonFolders = C_FileSystem.getFilesInFolder(WEBCLIENT_ADDONS_DIR);
		return addonFolders;
	},
};
