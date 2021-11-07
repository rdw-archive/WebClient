var format = require("util").format;

const C_Networking = {
	isSocketOpen: false,
	openWebsocket: function (URL, identifier) {
		const socket = new WebSocket(URL, identifier);
		C_Networking.socket = socket;
		C_Networking.isSocketOpen = true;
		socket.onmessage = function (event) {
			const messageString = event.data;
			C_EventSystem.triggerEvent("WEBSOCKET_INCOMING_MESSAGE", messageString);
		};

		socket.onopen = function (event) {
			C_Networking.isSocketOpen = true;
			C_EventSystem.triggerEvent("WEBSOCKET_STATUS_CHANGE");
		};

		socket.onclose = function (event) {
			C_Networking.isSocketOpen = false;
			C_EventSystem.triggerEvent("WEBSOCKET_STATUS_CHANGE");
		};

		socket.onerror = function (event) {
			C_Networking.isSocketOpen = false;
			C_EventSystem.triggerEvent("WEBSOCKET_STATUS_CHANGE");
		};

		C_EventSystem.triggerEvent("WEBSOCKET_STATUS_CHANGE");
	},
	closeWebsocket: function (URL, identifier) {
		if (!C_Networking.isSocketOpen) return;
		C_Networking.socket.close();
		C_Networking.isSocketOpen = false;

		C_EventSystem.triggerEvent("WEBSOCKET_STATUS_CHANGE");
	},
	isWebsocketOpen(URL, identifier) {
		return C_Networking.isSocketOpen;
	},
	sendRequest(URL, identifier, data) {
		if (!URL) {
			NOTICE("Usage: C_Networking.sendRequest(URL, identifier,  data)");
			return;
		}
		DEBUG("Sending message: " + data);

		if (!C_Networking.isSocketOpen) {
			WARNING(
				format(
					"Failed to send request %s to URL %s (WebSocket not open)",
					data,
					URL
				)
			);
			return;
		}
		C_Networking.socket.send(data);
	},
};
