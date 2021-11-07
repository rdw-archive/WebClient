const { app, BrowserWindow } = require("electron");

const JsonConfigLoader = require("./JsonConfigLoader");

// This surely isn't a great feat of engineering, but at least I don't have to see it anymore
const configLoader = new JsonConfigLoader();
let devToolsWindow = null;

const MAIN_THREAD_SETTINGS_PATH = "./Config/electron-launcher.json";
const DEFAULT_DEV_TOOLS_DOCKING_MODE = "detach"; // It's the only mode we support currently, as the others cause visual glitches
const DEFAULT_DEV_TOOLS_WINDOW_START_POSITION = { x: 0, y: 0 };
const DEFAULT_DEV_TOOLS_WINDOW_START_DIMENSIONS = { width: 500, height: 500 };

class ElectronApp {
	constructor(applicationTitle = "WebClient") {
		this.applicationTitle = applicationTitle;

		this.mainWindow = null;
		this.devToolsWindow = null;

		app.whenReady().then(() => this.onApplicationInitialized());

		app.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				app.quit();
			}
		});

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				this.createMainWindow();
			}
		});
	}
	loadConfiguration() {
		configLoader.setSettingsPath(MAIN_THREAD_SETTINGS_PATH);
		configLoader.loadSettingsFromDisk();
	}
	onApplicationInitialized() {
		this.loadConfiguration();
		this.createMainWindow();
	}
	createMainWindow() {
		const mainWindow = new BrowserWindow({
			width: 1900,
			height: 1080,
			transparent: true,
			frame: false,
			show: false, // trigger manually after first render to avoid visual flash (mostly for windowed/frame mode)
			fullscreen: true,
			icon: "Interface/Icons/favicon_v2.ico",
			webPreferences: {
				// INSECURE, but right now it doesn't matter (see https://github.com/RevivalEngine/WebClient/issues/9)
				nodeIntegration: true,
				contextIsolation: false,
				// TODO: Remove these two settings and all comments referring to them
				devTools: true,
				backgroundThrottling: false, // It's really annoying
				spellcheck: false, // It will automatically mark ALL input fields, which is jucky
				enableRemoteModule: true, // needed only to access dev tools from code (disable for production?)
				additionalArguments: "--js-flags=\"--max-old-space-size=8192\"", // for the renderer process (main uses setting in package.json?)
				// tbd I think the latter doesn't work in built apps, though? see https://github.com/electron/electron/issues/22705
			},
		});
		mainWindow.loadFile("index.html");

		mainWindow.once("ready-to-show", () => {
			mainWindow.show();
			if (configLoader.settings.enableDevTools) this.createDevToolsWindow(mainWindow);
		});

		this.mainWindow = mainWindow;
	}
	createDevToolsWindow() {
		const mainWindow = this.mainWindow;

		const devToolsOptions = {
			mode: configLoader.settings.devToolsDockingMode || DEFAULT_DEV_TOOLS_DOCKING_MODE,
			position: configLoader.settings.devToolsWindowStartPosition || DEFAULT_DEV_TOOLS_WINDOW_START_POSITION,
			dimensions: configLoader.settings.devToolsWindowStartDimensions || DEFAULT_DEV_TOOLS_WINDOW_START_DIMENSIONS,
		};

		devToolsWindow = new BrowserWindow({
			frame: !(configLoader.settings.hideDevToolsWindowTitle || false),
			parent: mainWindow,
			skipTaskbar: true,
		});

		devToolsWindow.setMenuBarVisibility(false);
		mainWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
		mainWindow.webContents.openDevTools({ mode: devToolsOptions.mode });
		// I guess this doesn't need localizing as it's not part of the regular user experience
		devToolsWindow.setTitle(this.applicationTitle + ": DevTools");

		devToolsWindow.blur(); // Focus should remain on the main window

		if (configLoader.settings.maximizeDevToolsWindow) devToolsWindow.maximize();

		mainWindow.webContents.once("did-finish-load", function () {
			devToolsWindow.setPosition(devToolsOptions.position.x, devToolsOptions.position.y);
			devToolsWindow.setSize(devToolsOptions.dimensions.width, devToolsOptions.dimensions.height);
		});

		mainWindow.on("close", this.persistDevToolsWindowSettings);
		devToolsWindow.on("close", this.persistDevToolsWindowSettings);

		this.devToolsWindow = devToolsWindow;
	}
	onApplicationShutdown() {
		this.saveConfiguration();
	}
	saveConfiguration() {
		this.persistDevToolsWindowSettings();
	}
	persistDevToolsWindowSettings() {
		if (!devToolsWindow || devToolsWindow.isDestroyed()) return; // It was probably closed manually and the settings should already be saved
		const bounds = devToolsWindow.getBounds();
		configLoader.settings.devToolsWindowStartPosition = {
			x: bounds.x,
			y: bounds.y,
		};
		configLoader.settings.devToolsWindowStartDimensions = {
			width: bounds.width,
			height: bounds.height,
		};
		configLoader.saveSettingsToDisk();

		devToolsWindow = null; // Mark as destroyed, I guess?
	}
}

module.exports = ElectronApp;
