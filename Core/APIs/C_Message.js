var format = require("util").format;

const C_Message = {
	unprocessedMessages: [],
	postMessage: function (event, ...payload) {
		const messageConstructor = GLOBAL_MESSAGE_DB[event];
		if (!messageConstructor) {
			WARNING(format("Failed to post message %s (no packet definition found)", event));
			return;
		}
		const version = 1.0; // hardcoded for now, see below
		const message = new messageConstructor(event, version, payload);

		let messageString = message.toString();
		DEBUG(format("Posting message %s", messageString));

		if (C_Settings.getValue("packMessages")) messageString = MESSAGEPACK.encode(messageString);
		C_Networking.sendRequest(C_Settings.getValue("worldServerURL"), "nyi", messageString);
	},
	getNextUnprocessedMessage: function () {
		return C_Message.unprocessedMessages.shift();
	},
	storeUnprocessedMessage: function (messageString) {
		C_Message.unprocessedMessages.push(messageString);
	},
	processResponse: function (messageString) {
		const eventInfo = C_Message.parseMessageString(messageString);
		C_EventSystem.triggerEvent(eventInfo.event, eventInfo.payload);
	},
	parseMessageString: function (messageString) {
		const tokens = messageString.split(C_Settings.getValue("messageTokenSeparatorString"));
		const messageType = tokens.shift();
		// const version = tokens.shift(); // nyi
		const version = 1.0; // no need to deal with this before alpha or even beta, so it'll be hardcoded to 1.0
		const payload = tokens;
		const messageConstructor = GLOBAL_MESSAGE_DB[messageType]; // I don't like this, but for now it'll do...
		if (!messageConstructor) {
			WARNING(format("Failed to parse message string %s (no packet definition found)", messageString));
			return;
		}
		return new messageConstructor(messageType, version, payload);
		// return new Message(messageType, version, payload); // As a fallback (doesn't differentiate between versions/no payload is supported)
	},
};
