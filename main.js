const { app, BrowserWindow } = require("electron");

function createWindow() {
	const win = new BrowserWindow({
		width: 1900,
		height: 1080,
		transparent: true,
		frame: false,
		show: false, // trigger manually after first render to avoid visual flash (mostly for windowed/frame mode)
		fullscreen: true,
		icon: "icon.ico",
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
			backgroundThrottling: false, // It's really annoying
			spellcheck: false, // It will automatically mark ALL input fields, which is jucky
			enableRemoteModule: true, // needed only to access dev tools from code (disable for production?)
			additionalArguments: '--js-flags="--max-old-space-size=8192"'  // for the renderer process (main uses setting in package.json?)
			// tbd I think the latter doesn't work in built apps, though? see https://github.com/electron/electron/issues/22705
		},
	});
	win.loadFile("index.html");

	win.once("ready-to-show", () => {
		win.show();
	});
}
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
