class LoadingScreen {
	constructor(name = new UniqueID().toString()) {
		const frame = new Frame(name);
		frame._obj.style.zIndex = 10000; // frame.setLayer(Enum.FRAME_LAYER_OVERLAY)
		this.frame = frame;

		const foregroundImage = new Image();
		frame._obj.appendChild(foregroundImage); // frame.addChild(backgroundImage)
		foregroundImage.id = "LoadingScreenForegroundImage";
		this.foregroundImage = foregroundImage;

		const backgroundImage = new Image();
		frame._obj.appendChild(backgroundImage); // frame.addChild(backgroundImage)
		backgroundImage.id = "LoadingScreenBackgroundImage";
		this.backgroundImage = backgroundImage;

		this.backgroundImagePath = null;
		this.foregroundImagePath = null;

		const progressTextBar = new Frame("LoadingScreenTextBar", frame);
		this.progressTextBar = progressTextBar;

		const spinnerContainer = new Frame("LoadingScreenSpinner", progressTextBar);
		this.spinner = spinnerContainer;

		const paragraph = new Paragraph("LoadingScreenText", progressTextBar, "GameFontNormal");
		this.paragraph = paragraph;
	}
	setBackgroundImage(filePath) {
		this.backgroundImagePath = filePath;
		this.backgroundImage.src = filePath;
	}
	setForegroundImage(filePath) {
		this.foregroundImagePath = filePath;
		this.foregroundImage.src = filePath;
	}
	// Since the image src will be modified by the browser (file protocol prefix, UNIX separators...) we can't use it directly
	getBackgroundImage() {
		return this.backgroundImagePath;
	}
	getForegroundImage() {
		return this.foregroundImagePath;
	}
	setProgressText(text) {
		this.paragraph.setText(text);
	}
	show() {
		this.frame.show();
	}
	hide() {
		this.frame.hide();
	}
}

// Experimental, refactor later and finalize it once the design has been tested some more
// Not sure about the required info (jsdoc can probably infer a lot of this on its own?)
class C_LoadingScreen extends API {
	constructor() {
		super();

		this.name = "C_LoadingScreen"; // redundant?
		this.events = [
			{
				name: "LOADING_SCREEN_ENABLED",
				arguments: {},
			},
			{
				name: "LOADING_SCREEN_DISABLED",
				arguments: {},
			},
		];

		this.fields = {
			// Let jsdoc handle it?
		};

		this.functions = {
			// also via jsdoc?
		};
	}
	static setBackgroundImagePath(filePath) {
		LoadingScreenFrame.setBackgroundImage(filePath);
	}
	static getBackgroundImagePath() {
		return LoadingScreenFrame.getBackgroundImage();
	}
	static setForegroundImagePath(filePath) {
		LoadingScreenFrame.setForegroundImage(filePath);
	}
	static getForegroundImagePath() {
		return LoadingScreenFrame.getForegroundImage();
	}
	static scheduleLoadingScreenTask(taskID = "LoadingScreenTask#" + new UniqueID().toString(), taskExecutionFunction) {
		const asyncLoadingScreenTask = function* () {
			LoadingScreenFrame.show();
			yield;

			taskExecutionFunction();

			LoadingScreenFrame.hide();
		};

		const coroutine = C_Rendering.scheduleMultiFrameTask(taskID, asyncLoadingScreenTask);
		return coroutine;
	}
}

const LoadingScreenFrame = new LoadingScreen("LoadingScreenFrame");
LoadingScreenFrame.setProgressText(L["NOW LOADING..."]);
LoadingScreenFrame.hide();
