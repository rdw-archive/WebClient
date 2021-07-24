const C_WebView = {};

C_WebView.openWindow = function (URL) {
	if (this.openedWindowProxy && !this.openedWindowProxy.closed) {
		NOTICE(
			format(
				"Failed to open WebView for URL %s (another view is already open)",
				URL
			)
		);
		return;
	}

	INFO(format("Attempting to open WebView for URL %s", URL));
	this.openedWindowProxy = window.open(
		URL,
		"_blank",
		"preload=true,nodeIntegration=false,contextIsolation=true"
	);
};
