const LoadingScreenFrame = new Frame("LoadingScreenFrame", ViewportContainer); // it should cover the entire UI

LoadingScreenFrame.setLoadingScreenText = function (loadingScreenText = "") {
	this.loadingScreenText.setText(loadingScreenText);
};

LoadingScreenFrame.onSceneLoadingStarted = function (event, mapID) {
	const mapInfo = C_ContentInfo.getMapInfo(mapID); // C_ContentInfo is deprecated
	this.loadingScreenText.setText(
		L["Loading"] + ": " + mapID + " (" + mapInfo.displayName + ")"
	);
	this.show();
	// -- UIParent:SetShown(false) -- Hide UI when loading things to only display the loading screen
	// -- Also hide the world frame? (so rendering appears to be finished when the loading screen is gone)
};

LoadingScreenFrame.loadingScreenText = LoadingScreenFrame.createFontString(
	"LoadingScreenProgressText",
	"HIGH",
	"TitleFontNormal"
);
LoadingScreenFrame.loadingScreenText.setText(L["Loading"] + ": " + "TBD");
LoadingScreenFrame.hide(); // todo via css
// LoadingScreenFrame.registerEvent("SCENE_LOADING_STARTED", "OnSceneLoadingStarted");
// LoadingScreenFrame.registerEvent("SCENE_LOADING_PLAYABLE", "OnSceneLoadingPlayable");
// -- TODO: SCENE_LOADING_COMPLETE handing? Show indicator in the corner if resources are still loading, but gameplay has already started (WOW style)

LoadingScreenFrame.setScript("OnClick", function () {
	LoadingScreenFrame.hide();
});
