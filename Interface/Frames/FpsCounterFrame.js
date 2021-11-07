const FpsCounterFrame = new Frame("FpsCounterFrame", ViewportContainer);

FpsCounterFrame.onFpsUpdate = function (event, fps) {
	FpsCounterFrame.fontString.setText(L["FPS"] + ": " + Math.floor(fps + 0.5));
	FpsCounterFrame.setShown(RENDERER_SHOW_FPS);
};

FpsCounterFrame.onLoad = function () {
	const fpsCounterText = FpsCounterFrame.createFontString("FpsCounterText", "HIGH", "GameFontSmallest");
	fpsCounterText.setText(L["FPS"] + ": " + 0); // This default value will be updated automatically by the renderer
	this.fontString = fpsCounterText;
	this.setShown(RENDERER_SHOW_FPS);
	C_EventSystem.registerEvent("FPS_COUNTER_UPDATE", "FpsCounterFrame", this.onFpsUpdate);

	function toggleFpsFrame() {
		FpsCounterFrame.toggle();
		RENDERER_SHOW_FPS = !RENDERER_SHOW_FPS; // to make sure it stays hidden/shown
	}
	C_Keybindings.setBinding(Enum.KEY_CODE_F, toggleFpsFrame);
};

FpsCounterFrame.onLoad();
