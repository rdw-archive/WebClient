const C_System = {
	reloadRenderProcess() {
		C_EventSystem.triggerEvent("APPLICATION_SHUTDOWN");

		require("electron").remote.getCurrentWindow().reload(); // Hack; should use proper IPC and do it in main.js (later)
	},
	reload() {
		this.reloadRenderProcess(); // Convenience alias (to be revisited later)
	},
	quit() {
		C_EventSystem.triggerEvent("APPLICATION_SHUTDOWN");
		require("electron").remote.getCurrentWindow().close(); // Hack; should use proper IPC and do it in the main thread (later)
	}
};
