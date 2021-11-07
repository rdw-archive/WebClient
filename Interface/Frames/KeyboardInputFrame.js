const KeyboardInputFrame = new Frame("KeyboardInputFrame", ViewportContainer);

KeyboardInputFrame.onKeyboardInputReceived = function (event, keyCode, keyString) {
	KeyboardInputFrame.fontString.setText(L["Last Key"] + ": " + keyCode + " (" + keyString + ")");
};

KeyboardInputFrame.onLoad = function () {
	const text = KeyboardInputFrame.createFontString("KeyboardInputText", "HIGH", "GameFontSmallest");
	text.setText(L["Last Key"] + ": " + "NONE"); // This default value will be updated automatically by the renderer
	this.fontString = text;
	C_EventSystem.registerEvent("KEY_UP", "KeyboardInputFrame", this.onKeyboardInputReceived); // tbd use KEY_UP if mode is RESPONSIVE? (setting)

	function toggleFrame() {
		KeyboardInputFrame.toggle();
	}
	C_Keybindings.setBinding(Enum.KEY_CODE_K, toggleFrame);
};

KeyboardInputFrame.onLoad();
