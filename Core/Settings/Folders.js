// These folders must be provided as a path relative to the application root (wherever index.html is located)
const WEBCLIENT_ROOT_DIR = __dirname; // This is NOT always cwd (.), if electron is run from elsewhere :(
const WEBCLIENT_ASSETS_DIR = WEBCLIENT_ROOT_DIR + "/Assets";
const WEBCLIENT_INTERFACE_DIR = WEBCLIENT_ROOT_DIR + "/Interface";
const WEBCLIENT_ADDONS_DIR = WEBCLIENT_INTERFACE_DIR + "/Addons";
const WEBCLIENT_LOCALES_DIR = WEBCLIENT_ROOT_DIR + "/Locales";
const WEBCLIENT_EXPORTS_DIR = WEBCLIENT_ROOT_DIR + "/Exports";
const WEBCLIENT_SETTINGS_DIR = WEBCLIENT_ROOT_DIR + "/Core/Settings";
