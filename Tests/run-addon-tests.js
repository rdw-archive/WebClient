Channels[Enum.LOG_LEVEL_DEBUG] = null;
Channels[Enum.LOG_LEVEL_INFO] = null;
Channels[Enum.LOG_LEVEL_WARNING] = null;

// This executes whatever tests have been registered by addons (on load, via C_Testing.registerTestSuite)
C_Testing.loadAddonTests();
