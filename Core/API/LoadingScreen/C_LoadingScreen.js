const C_LoadingScreen = {
	setBackground(filePath) {
		LoadingScreenFrame.setBackgroundImage(filePath);
	},
	getBackground() {
		return LoadingScreenFrame.getBackgroundImage();
	},
	setLogo(filePath) {
		LoadingScreenFrame.setForegroundImage(filePath);
	},
	getLogo() {
		return LoadingScreenFrame.getForegroundImage();
	},
	scheduleLoadingScreenTask(taskID = "LoadingScreenTask#" + new UniqueID().toString(), taskExecutionFunction) {
		const asyncLoadingScreenTask = function* () {
			LoadingScreenFrame.show();
			yield;

			taskExecutionFunction();

			LoadingScreenFrame.hide();
		};

		const coroutine = C_Rendering.scheduleMultiFrameTask(taskID, asyncLoadingScreenTask);
		return coroutine;
	},
};
