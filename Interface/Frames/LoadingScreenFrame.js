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

const LoadingScreenFrame = new LoadingScreen("LoadingScreenFrame");
LoadingScreenFrame.setProgressText(L["NOW LOADING..."]);
LoadingScreenFrame.hide();
