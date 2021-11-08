// Disable spammy debug messages to provide a short summary
// Note: This is mainly useful for developing, where it will be easier to recognize test failures this way
// In the CI, failures will cancel the workflow (very obvious) and the more verbose logging is enabled
Channels[Enum.LOG_LEVEL_DEBUG] = null;
Channels[Enum.LOG_LEVEL_INFO] = null;
Channels[Enum.LOG_LEVEL_WARNING] = null;

require("./run-renderer-tests.js");
