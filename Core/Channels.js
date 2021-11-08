const Channels = {
	[Enum.LOG_LEVEL_NONE]: new Logger({
		[Enum.LOG_LEVEL_NONE]: true,
	}),
	[Enum.LOG_LEVEL_TEST]: new Logger({
		[Enum.LOG_LEVEL_TEST]: true,
	}),
	[Enum.LOG_LEVEL_DEBUG]: new Logger({
		[Enum.LOG_LEVEL_DEBUG]: true,
	}),
	[Enum.LOG_LEVEL_INFO]: new Logger({
		[Enum.LOG_LEVEL_INFO]: true,
	}),
	[Enum.LOG_LEVEL_NOTICE]: new Logger({
		[Enum.LOG_LEVEL_NOTICE]: true,
	}),
	[Enum.LOG_LEVEL_WARNING]: new Logger({
		[Enum.LOG_LEVEL_WARNING]: true,
	}),
	[Enum.LOG_LEVEL_CRITICAL]: new Logger({
		[Enum.LOG_LEVEL_CRITICAL]: true,
	}),
	[Enum.LOG_LEVEL_SERVER]: new Logger({
		[Enum.LOG_LEVEL_SERVER]: true,
	}),
}

function TEST (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_TEST];
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_TEST);
};

function DEBUG (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_DEBUG];
	// console.log(outputChannel, message);
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_DEBUG);
};

function INFO (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_INFO];
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_INFO);
};

function NOTICE (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_NOTICE];
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_NOTICE);
};

function WARNING (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_WARNING];
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_WARNING);
};

function CRITICAL (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_CRITICAL];
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_CRITICAL);
};

function SERVER (message) {
	let outputChannel = Channels[Enum.LOG_LEVEL_SERVER];
	if (! outputChannel) return;
	outputChannel.log(message, Enum.LOG_LEVEL_SERVER);
};