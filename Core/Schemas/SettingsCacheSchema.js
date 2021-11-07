const SettingsCacheSchema = JOI.object({
	// Schema Metadata
	version: JOI.number().integer().positive().required(),

	// Addon API
	defaultAddonLoadedState: JOI.boolean().required(),

	// Widget API
	displayWidgetMetadata: JOI.boolean().required(),

	// EventSystem API
	permittedEventTriggers: JOI.object().required().pattern(/\w+/, JOI.boolean()),

	// Keybindings API
	keybindingActivationMode: JOI.string()
		.required()
		.valid(KEYBINDS_ACTIVATE_ON_KEY_UP, KEYBINDS_ACTIVATE_ON_KEY_DOWN),

	// Localization API
	activeLocale: JOI.string()
		.required()
		.valid(
			Enum.WEBCLIENT_LOCALE_STRING_ENGLISH,
			Enum.WEBCLIENT_LOCALE_STRING_GERMAN,
			Enum.WEBCLIENT_LOCALE_STRING_FRENCH,
			Enum.WEBCLIENT_LOCALE_STRING_SPANISH,
			Enum.WEBCLIENT_LOCALE_STRING_RUSSIAN,
			Enum.WEBCLIENT_LOCALE_STRING_CHINESE_SIMPLIFIED,
			Enum.WEBCLIENT_LOCALE_STRING_CHINESE_TRADITIONAL,
			Enum.WEBCLIENT_LOCALE_STRING_ITALIAN,
			Enum.WEBCLIENT_LOCALE_STRING_KOREAN,
			Enum.WEBCLIENT_LOCALE_STRING_PORTUGUESE
		),

	// Logging API
	enableLogging: JOI.boolean().required(),
	activeLogLevels: JOI.object().pattern(/\w+/, JOI.boolean()),
	// TBD Move to Profiling API?
	enableProfiling: JOI.boolean().required(),

	// Macro API
	defaultMacroIconPath: JOI.string().required(),
	macroCachePath: JOI.string().required(),

	// Networking API
	worldServerURL: JOI.string().uri().required(),
	messageTokenSeparatorString: JOI.string().length(1).required(),
	packMessages: JOI.boolean().required(),

	// Rendering API (TBD some settings might be used by the WebGL API instead?)
	showFPS: JOI.boolean().required(),
	useAntialiasing: JOI.boolean().required(),
	enableAlphaChannel: JOI.boolean().required(),
	optimizeSceneLookupOperations: JOI.boolean().required(),
	enableFogEffect: JOI.boolean().required(),
	showCoordinateAxes: JOI.boolean().required(),
	wireframeGeometry: JOI.boolean().required(),
	fpsUpdateIntervalInFrames: JOI.number().integer().min(1).required(),
	pixelsPerWorldUnit: JOI.number().integer().min(1).required(),
	debugMeshRenderGroupID: JOI.number().integer().required(),
	numSpriteDrawLayers: JOI.number().integer().required(),
	defaultFogParameters: JOI.object({
		fogMode: JOI.string().required().valid("LINEAR", "EXP", "EXP2"),
		minDistanceInWorldUnits: JOI.number().required().positive(),
		maxDistanceInWorldUnits: JOI.number().required().positive(),
		nearLimitInWorldUnits: JOI.number().required().positive(),
		farLimitInWorldUnits: JOI.number().required().positive(),
		exponentialFogDensity: JOI.number().required().positive(),
		fogColorRGBA: JOI.object({
			red: JOI.number().integer().min(0).max(255),
			green: JOI.number().integer().min(0).max(255),
			blue: JOI.number().integer().min(0).max(255),
			alpha: JOI.number().integer().min(0).max(255),
		}).required(),
	}),
	defaultSceneBackgroundColorRGBA: JOI.object({
		red: JOI.number().integer().min(0).max(255),
		green: JOI.number().integer().min(0).max(255),
		blue: JOI.number().integer().min(0).max(255),
		alpha: JOI.number().integer().min(0).max(255),
	}).required(),
});
