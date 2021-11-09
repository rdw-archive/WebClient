// Responsibility: Aid in profiling performance bottlenecks (without halting/slowing execution; use Chrome DevTools for more detailed profiling)
const C_Profiling = {
	// TBD: Should this be moved to the logging API and function as a separate channel? For now it seems better to disable it globally if needed
	profilingLogPrefixString: "[" + Enum.LOG_LEVEL_PROFILE + "] ",
	startTimer(label) {
		if (!C_Settings.getValue("enableProfiling")) return;
		console.time(this.profilingLogPrefixString + label);
	},
	endTimer(label) {
		if (!C_Settings.getValue("enableProfiling")) return;
		console.timeEnd(this.profilingLogPrefixString + label);
	},
	getTimer(label) {
		if (!C_Settings.getValue("enableProfiling")) return;
		console.timeLog(this.profilingLogPrefixString + label);
	},
};
