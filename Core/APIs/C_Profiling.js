// Responsibility: Aid in profiling performance bottlenecks (without halting/slowing execution; use Chrome DevTools for more detailed profiling)
const C_Profiling = {
	// TBD: Should this be moved to the logging API and function as a separate channel? For now it seems better to disable it globally if needed
	profilingLogPrefixString: "[" + LOG_LEVEL_PROFILE + "] ",
	startTimer(label) {
		if (!WEBCLIENT_ENABLE_PROFILING) return;
		console.time(this.profilingLogPrefixString + label);
	},
	endTimer(label) {
		if (!WEBCLIENT_ENABLE_PROFILING) return;
		console.timeEnd(this.profilingLogPrefixString + label);
	},
	getTimer(label) {
		if (!WEBCLIENT_ENABLE_PROFILING) return;
		console.timeLog(this.profilingLogPrefixString + label);
	},
};
