// Basic interface for interacting with the client's event system.
const C_EventSystem = {
	eventListeners: {},
	squelchedEvents: {
		RENDER_LOOP_UPDATE: true,
		FPS_COUNTER_UPDATE: true,
		KEY_DOWN: true,
		KEY_UP: true,
	},
	registerEvent(event, listenerID, onEventCallback) {
		if (!this.isEventEnabled(event)) {
			WARNING(
				format(
					"Failed to register %s for event %s (triggers for this event are disabled)",
					listenerID,
					event
				)
			);
			return;
		}

		if (this.isEventMonitoredByListener(event, listenerID)) {
			NOTICE(
				format(
					"Failed to register %s for event %s (already registered)",
					listenerID,
					event
				)
			);
			return;
		}

		if (typeof onEventCallback !== "function") {
			WARNING(
				format(
					"Failed to register %s for event %s (onEventCallback not a function)",
					listenerID,
					event
				)
			);
			return;
		}

		DEBUG(format("Registered new listener %s for event %s", listenerID, event));

		this.eventListeners[event] = this.eventListeners[event] || {}; // in case this is the first listener for this event
		this.eventListeners[event][listenerID] = onEventCallback;
	},
	isEventEnabled(event) {
		return WEBCLIENT_ENABLED_EVENT_TRIGGERS[event] === true;
	},
	isEventMonitoredByListener(event, listenerID) {
		if (!this.eventListeners[event]) return false;
		return typeof this.eventListeners[event][listenerID] === "function";
	},
	triggerEvent(event, ...args) {
		const registeredListeners = this.eventListeners[event];
		if (!registeredListeners) {
			// No point in triggering events that go into the void
			return;
		}

		for (const listenerID in registeredListeners) {
			const onEventCallback = registeredListeners[listenerID];
			if (!this.squelchedEvents[event])
				format("Triggering global UI event %s", event); // No need to spam this notification
			onEventCallback(event, ...args);
		}
	},
	unregisterEvent(event, listenerID) {
		if (!this.eventListeners[event][listenerID]) return;

		delete this.eventListeners[event][listenerID];

		DEBUG(format("Unregistered listener %s for event %s", listenerID, event));
	},
};
