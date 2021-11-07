const C_Settings = {};

C_Settings.getValue = function (key) {
	return WebClient.settings[key] || "";
};

C_Settings.setValue = function (key, value) {
	WebClient.settings[key] = value;
};
