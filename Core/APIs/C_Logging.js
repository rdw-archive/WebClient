const C_Logging = {
	loggers: {},
	createLoggers() {
		this.loggers[LOG_LEVEL_NONE] = new Logger({ [LOG_LEVEL_NONE]: true });
		this.loggers[LOG_LEVEL_TEST] = new Logger({ [LOG_LEVEL_TEST]: true });
		this.loggers[LOG_LEVEL_DEBUG] = new Logger({ [LOG_LEVEL_DEBUG]: true });
		this.loggers[LOG_LEVEL_INFO] = new Logger({ [LOG_LEVEL_INFO]: true });
		this.loggers[LOG_LEVEL_NOTICE] = new Logger({ [LOG_LEVEL_NOTICE]: true });
		this.loggers[LOG_LEVEL_WARNING] = new Logger({ [LOG_LEVEL_WARNING]: true });
		this.loggers[LOG_LEVEL_CRITICAL] = new Logger({ [LOG_LEVEL_CRITICAL]: true });
		this.loggers[LOG_LEVEL_SERVER] = new Logger({ [LOG_LEVEL_SERVER]: true });

		this.createLoggingAliases();
	},
	createLoggingAliases() {
		const self = this;
		window.TEST = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_TEST]) return;
			self.loggers[LOG_LEVEL_TEST].log(message, LOG_LEVEL_TEST);
		};

		window.DEBUG = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_DEBUG]) return;
			self.loggers[LOG_LEVEL_DEBUG].log(message, LOG_LEVEL_DEBUG);
		};

		window.INFO = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_INFO]) return;
			self.loggers[LOG_LEVEL_INFO].log(message, LOG_LEVEL_INFO);
		};

		window.NOTICE = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_NOTICE]) return;
			self.loggers[LOG_LEVEL_NOTICE].log(message, LOG_LEVEL_NOTICE);
		};

		window.WARNING = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_WARNING]) return;
			self.loggers[LOG_LEVEL_WARNING].log(message, LOG_LEVEL_WARNING);
		};

		window.CRITICAL = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_CRITICAL]) return;
			self.loggers[LOG_LEVEL_CRITICAL].log(message, LOG_LEVEL_CRITICAL);
		};

		window.SERVER = function (message) {
			if (!WEBCLIENT_ACTIVE_LOGGERS[LOG_LEVEL_SERVER]) return;
			self.loggers[LOG_LEVEL_SERVER].log(message, LOG_LEVEL_SERVER);
		};
	},
};
