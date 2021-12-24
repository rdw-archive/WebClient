var format = require("util").format;

const C_Macro = {
	macros: [],
};

C_Macro.create = function (name, icon, macroText) {
	const macro = new Macro(name, icon, macroText);
	const numMacros = this.macros.push(macro);
	const macroID = numMacros - 1;
	DEBUG(format("Created new macro %s", macroID));
	C_EventSystem.triggerEvent("MACRO_UPDATE");
	return macroID;
};

C_Macro.delete = function (macroID) {
	DEBUG(format("Deleted macro %s", macroID));
	this.macros[macroID] = null; // undefined will be stored as null in JSON anyway, so might as well use it consistently
	C_EventSystem.triggerEvent("MACRO_UPDATE");
};

C_Macro.getBody = function (macroID) {};

C_Macro.getMacroInfo = function (macroID) {
	return this.macros[macroID];
};

C_Macro.getNumMacros = function () {
	let numMacros = 0;
	// There may be holes in the array if macros have been removed, so we must count manually
	for (const macro of this.macros) {
		if (macro) numMacros++; // Skip holes (undefined values)
	}
	return numMacros;
};

C_Macro.runMacro = function (macroID) {
	const macro = this.macros[macroID];
	if (!macro) {
		NOTICE(format("Failed to run macro %s (no such macro exists)", macroID));
		return;
	}

	const macroText = macro.getBody();
	// Users should never run code directly unless they know what they're doing, but macros can't be used for XSS directly so it should be fine
	const script = new Function(macroText);
	script();
};
C_Macro.runMacroText = function (macroText) {};
C_Macro.setMacroSpell = function (macroID, spellID) {};

C_Macro.loadFromDisk = function (macroID) {};
C_Macro.saveToDisk = function (macroID) {};

C_Macro.restoreMacroCache = function () {
	DEBUG("Reloading macro cache from disk");

	const macroCachePath = C_Settings.getValue("macroCachePath");
	// Basically the same as initialization, though this may need revisiting in the future
	if (!C_FileSystem.fileExists(macroCachePath)) this.saveMacroCache();

	const macroCache = C_FileSystem.readJSON(macroCachePath);
	for (let macroID in macroCache) {
		const macroInfo = macroCache[macroID];
		DEBUG(format("Deserializing macro %s", macroID));

		if (macroInfo === null) {
			// this.macros[macroID] = null;
			continue;
		}

		const macro = new Macro(macroInfo.name, macroInfo.icon, macroInfo.text);
		// this.macros[macroID] = macro;
		this.macros.push(macro);
	}
	C_EventSystem.triggerEvent("MACRO_UPDATE");
};

C_Macro.saveMacroCache = function () {
	DEBUG("Saving macro cache to disk");
	const macroCache = [];
	for (let macroID = 0; macroID < this.macros.length; macroID++) {
		const macro = this.macros[macroID];
		if (!macro) continue;

		DEBUG(format("Serializing macro %s", macroID));
		const serializedMacro = macro.toJSON();
		// macroCache[macroID] = serializedMacro;
		macroCache.push(serializedMacro);
	}
	DEBUG(format("Writing macro cache to file %s", C_Settings.getValue("macroCachePath")));
	C_FileSystem.writeJSON(C_Settings.getValue("macroCachePath"), macroCache);
};

C_Macro.getNextMacroID = function () {
	return this.macros.length;
};
