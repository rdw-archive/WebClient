const C_System = {
	reloadRenderProcess() {
		require("electron").remote.getCurrentWindow().reload(); // Hack; should use proper IPC and do it in main.js (later)
	},
	reload() {
		this.reloadRenderProcess(); // Convenience alias (to be revisited later)
	},
};
