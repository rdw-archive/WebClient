const C_Settings = {};

C_Settings.getValue = function (key) {
	return WebClient.metadata.settings[key] || "";
};

C_Settings.setValue = function (key, value) {
	WebClient.metadata.settings[key] = value;
};
