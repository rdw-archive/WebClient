// This is a container for the canvas used to render the game world.
var WorldFrame = new Canvas("WorldFrame", ViewportContainer);
WorldFrame.enableMouse(true);
WorldFrame._obj.tabIndex = 2;
WorldFrame._obj.focus(); // tbd use ESC hierarchy to determine active frame (see WOW API)

WorldFrame.closableWindows = [];

WorldFrame.onEscapeKeyPressed = function () {
	WorldFrame.hideLastClosableWindow();
};

WorldFrame.addClosableWindow = function (window) {
	DEBUG(format("Added closable window %s", window.name));
	this.closableWindows.push(window);
};

WorldFrame.hideLastClosableWindow = function () {
	if (this.closableWindows.length === 0) return;

	const lastOpenedWindow = this.getLastVisibleClosableWindow();
	if (!lastOpenedWindow) return; // None are visible

	DEBUG(format("Hiding top-level closable window %s", lastOpenedWindow.name));
	lastOpenedWindow.hide();
};

WorldFrame.getLastVisibleClosableWindow = function () {
	for (let windowID = this.closableWindows.length - 1; windowID >= 0; windowID--) {
		const window = this.closableWindows[windowID];
		if (window.isShown()) return window;
	}
	// If none are shown, propagate the key press to the main menu so it can be shown
	GameMenuFrame.onEscapeKeyPressed();
};

C_Keybindings.setBinding(KEY_CODE_ESC, function () {
	WorldFrame.onEscapeKeyPressed();
});
