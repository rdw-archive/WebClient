describe("scheduleLoadingScreenTask", () => {
	it("should return a Coroutine that represents the scheduled task", () => {
		const taskExecutionFunction = function () {
			// NO-OP
		};
		const coroutine = C_LoadingScreen.scheduleLoadingScreenTask(taskExecutionFunction);
		assertTrue(coroutine instanceof Coroutine);
		assertFalse(coroutine.isDone()); // Even if it does nothing, it should be deferred until the next frame
	});

	it("should schedule a deferred task that is run over multiple frames", () => {
		const taskExecutionFunction = function () {
			// NO-OP
		};
		const coroutine = C_LoadingScreen.scheduleLoadingScreenTask(taskExecutionFunction);
		const taskID = coroutine.getTaskID();
		assertEquals(C_Rendering.getScheduledMultiFrameTask(taskID), coroutine);
	});
});
