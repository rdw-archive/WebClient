class Logger {
	constructor(logLevels) {
		this.logLevels = logLevels;
	}
	log(message, logLevel) {
		if (!this.logLevels[logLevel]) return;

		message = "[" + logLevel + "] " + message;

		switch (logLevel) {
			case Enum.LOG_LEVEL_DEBUG:
				console.debug(message);
				return;
			case Enum.LOG_LEVEL_INFO:
				console.info(message);
				return;
			case Enum.LOG_LEVEL_NOTICE:
				console.warn(message);
				return;
			case Enum.LOG_LEVEL_WARNING:
				console.warn(message);
				console.trace(message);
				return;
			case Enum.LOG_LEVEL_CRITICAL:
				console.error(message);
				console.trace(message);
				return;
			case Enum.LOG_LEVEL_SERVER:
				console.warn(message);
				return;
			default:
				// Implies LOG_LEVEL_NONE = Hide message
				return;
		}
	}
}
