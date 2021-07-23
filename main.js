const { app, BrowserWindow } = require("electron");

const ElectronAppLoader = require("./Core/ElectronAppLoader");

const MAIN_THREAD_SETTINGS_PATH = "Config/electron-launcher.json";
const DEFAULT_DEV_TOOLS_DOCKING_MODE = "detach"; // It's the only mode we support currently, as the others cause visual glitches
const DEFAULT_DEV_TOOLS_WINDOW_START_POSITION = { x: 0, y: 0 };
const DEFAULT_DEV_TOOLS_WINDOW_START_DIMENSIONS = { width: 500, height: 500 };

const loader = new ElectronAppLoader();
loader.setSettingsPath(MAIN_THREAD_SETTINGS_PATH);
loader.loadSettingsFromDisk();

let devtools = null;

function createDevToolsAtSavedPosition(mainWindow) {

	const devToolsOptions = {
		mode: loader.settings.devToolsDockingMode || DEFAULT_DEV_TOOLS_DOCKING_MODE,
		position: loader.settings.devToolsWindowStartPosition || DEFAULT_DEV_TOOLS_WINDOW_START_POSITION,
		dimensions: loader.settings.devToolsWindowStartDimensions || DEFAULT_DEV_TOOLS_WINDOW_START_DIMENSIONS
	};

	devtools = new BrowserWindow({
		frame : ! (loader.settings.hideDevToolsWindowTitle || false),
		parent : mainWindow,
		skipTaskbar : true,
  });

  devtools.setMenuBarVisibility(false);
  mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
  mainWindow.webContents.openDevTools({ mode: devToolsOptions.mode });
  devtools.setTitle("WebClient: DevTools"); // I guess this doesn't need localizing as it's not part of the regular user experience

  devtools.blur(); // Focus should remain on the main window

  if(loader.settings.maximizeDevToolsWindow) devtools.maximize();

  mainWindow.webContents.once('did-finish-load', function () {
		devtools.setPosition(devToolsOptions.position.x, devToolsOptions.position.y);
		devtools.setSize(devToolsOptions.dimensions.width, devToolsOptions.dimensions.height);
  });

  mainWindow.on("close", persistDevToolsWindowSettings);
  devtools.on("close", persistDevToolsWindowSettings);
}

function persistDevToolsWindowSettings() {
	if(!devtools || devtools.isDestroyed()) return; // It was probably closed manually and the settings should already be saved
	const bounds = devtools.getBounds();
	loader.settings.devToolsWindowStartPosition = { x: bounds.x, y: bounds.y };
	loader.settings.devToolsWindowStartDimensions = { width: bounds.width, height: bounds.height };
	loader.saveSettingsToDisk();

	devtools = null; // Mark as destroyed, I guess?
}

function createWindow() {
	const win = new BrowserWindow({
		width: 1900,
		height: 1080,
		transparent: true,
		frame: false,
		show: false, // trigger manually after first render to avoid visual flash (mostly for windowed/frame mode)
		fullscreen: true,
		icon: "Interface/Icons/favicon_v2.ico",
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
        if (loader.settings.enableDevTools) createDevToolsAtSavedPosition(win)
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
