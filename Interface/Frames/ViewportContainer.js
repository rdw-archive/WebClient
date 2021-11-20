// This is a container for the visible area, including render canvas and the entire UI.
let ViewportContainer = new Frame("ViewportContainer");

ViewportContainer.handleVisibilityChange = function () {
	if (document.hidden) {
		C_EventSystem.triggerEvent("APPLICATION_WINDOW_HIDDEN");
		C_WebAudio.setGlobalVolume(
			C_Settings.getValue("backgroundAudioVolume") * C_Settings.getValue("globalVolume"),
			false
		);
	} else {
		C_EventSystem.triggerEvent("APPLICATION_WINDOW_VISIBLE");
		C_WebAudio.setGlobalVolume(C_Settings.getValue("globalVolume"), false);
	}
};

ViewportContainer.onWindowVisibilityChanged = function (isNowHidden) {
	if (!C_Settings.getValue("fadeSoundInBackground")) return;

	ViewportContainer.handleVisibilityChange();
};

document.addEventListener(
	"visibilitychange",
	() => {
		ViewportContainer.onWindowVisibilityChanged(document.hidden);
	},
	false
);
