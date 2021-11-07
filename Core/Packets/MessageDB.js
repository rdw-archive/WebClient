class Message {
	constructor() {
		this.event = "PING";
		this.version = 0;
		this.payload = {};
	}
	toString() {
		const messageString =
			this.event + MESSAGE_TOKEN_SEPARATOR + this.version + MESSAGE_TOKEN_SEPARATOR + JSON.stringify(this.payload);
		return messageString;
	}
}

class ConnectionEstablishedMessage extends Message {
	constructor(event, version, payload) {
		super();

		this.event = event;
		this.version = version;
		this.payload = {
			accountID: payload.shift(),
		};
	}
}

class MacroUpdateRequest extends Message {
	constructor(event, version, payload) {
		super();

		this.event = event;
		this.version = version;

		if (version === 1)
			this.payload = {
				macroID: payload.shift(),
				macroText: payload.shift(),
			};
		console.log(this);
	}
}

const GLOBAL_MESSAGE_DB = {
	// WorldServer -> Client
	WEBSOCKET_CONNECTION: ConnectionEstablishedMessage,
	PONG: Message,
	// Client -> WorldServer
	REQUEST_MACRO_UPDATE: MacroUpdateRequest,
	PING: Message, // doesn't need to send any information
};
