const C_Keybindings = {
	handlers: {},
	setBinding(keyCode, onKeyPressedHandler) {
		if (this.handlers[keyCode])
			WARNING(
				"Set binding for keyCode " +
					keyCode +
					" (overriding the existing binding)"
			);

		INFO("Set new keybind for keyCode " + keyCode);
		this.handlers[keyCode] = onKeyPressedHandler;
	},
	isBindingSet(keyCode) {
		return this.handlers[keyCode] !== undefined;
	},
	executeBinding(keyCode) {
		if (!this.isBindingSet(keyCode)) return;

		const inputHandler = this.handlers[keyCode];
		DEBUG("Executing input handler for binding " + keyCode);
		inputHandler(); // tbd pass modifiers here? or just let the handler query them if needed? (the latter seems more sensible)
	},
};
