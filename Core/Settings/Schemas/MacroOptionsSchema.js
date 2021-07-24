const MacroOptionsSchema = JOI.object({
	defaultMacroIconPath: JOI.string().required(),
	macroCachePath: JOI.string().required(),
});
