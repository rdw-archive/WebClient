class Coroutine {
	static STATUS_INITIALIZED = "Initialized";
	static STATUS_DONE = "Done";
	constructor(taskID, taskGeneratorFunction) {
		this.task = taskGeneratorFunction();

		// Very useful for debugging - we don't care about the memory overhead since there won't be many coroutines running
		this.taskID = taskID;
		this.scheduledTime = Date.now();

		// Bookkeeping to help make it all testable without having to delve into the god-awful JS syntax every time
		this.status = Coroutine.STATUS_INITIALIZED;
		this.lastReturnValue = null;
	}
	getTaskID() {
		return this.taskID;
	}
	getTaskFunction() {
		return this.task;
	}
	isDone() {
		return this.status === Coroutine.STATUS_DONE;
	}
	// Mimick the interface provided by the iterator that is created by the original GeneratorFunction
	// This is effectively a fake Iterator interface so that the engine can step through the task as it would with other iterators
	// While this is quite ugly, BJS will simply call next() on whatever we pass to it so it "just works"
	next() {
		return this.resume();
	}
	// This is the API we actually want
	resume() {
		const result = this.task.next();
		this.lastReturnValue = result.value;

		if (result.done === true) this.status = Coroutine.STATUS_DONE;

		return result;
	}
}
