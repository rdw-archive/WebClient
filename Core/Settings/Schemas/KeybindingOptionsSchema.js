const KeybindingOptionsSchema = JOI.object({
	keybindingActivationMode: JOI.string()
		.required()
		.valid(KEYBINDS_ACTIVATE_ON_KEY_UP, KEYBINDS_ACTIVATE_ON_KEY_UP),
});
